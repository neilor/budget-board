import * as React from 'react';
import { isEqual } from 'lodash';

import firebase from '../../services/firebase';

export interface IDatabaseObservableProps {
  path: string;
  eventName?: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved';

  snapSelector?: (dataSnapshot: firebase.database.DataSnapshot) => any;

  orderByChild?: string;
  orderByKey?: boolean;
  orderByPriority?: boolean;
  orderByValue?: boolean;

  startAt?: string;
  endAt?: string;
  equalTo?: string | boolean;

  limitToFirst?: number;
  limitToLast?: number;
}

interface IPropsPrivate {
  children: (
    loading: boolean,
    error: any,
    data: any,
  ) => React.ReactNode;
}

interface IState {
    data: any;
    error: any;
    loading: boolean;
}

type IProps = IDatabaseObservableProps & IPropsPrivate;

export default class DatabaseObservable extends React.Component<IProps, IState> {

    private subscriptionCallback?: any;
    private authUnsubscriber?: any;

    constructor(props: IProps){
        super(props);
        this.state = {
            data: null,
            error: null,
            loading: true,
        }
    }

    public componentDidMount() {
        this.subscribe(this.props)
    }

    public componentWillUnmount() {
        this.unsubscribe(this.props);
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            !isEqual(this.props.path, prevProps.path) ||
            !isEqual(this.props.eventName, prevProps.eventName) ||

            !isEqual(this.props.startAt, prevProps.startAt) ||
            !isEqual(this.props.endAt, prevProps.endAt) ||
            !isEqual(this.props.equalTo, prevProps.equalTo) ||

            !isEqual(this.props.orderByChild, prevProps.orderByChild) ||
            !isEqual(this.props.orderByKey, prevProps.orderByKey) ||
            !isEqual(this.props.orderByPriority, prevProps.orderByPriority) ||
            !isEqual(this.props.orderByValue, prevProps.orderByValue) ||

            !isEqual(this.props.limitToFirst, prevProps.limitToFirst) ||
            !isEqual(this.props.limitToLast, prevProps.limitToLast)
            ){
            this.unsubscribe(prevProps);
            this.setState({ data: null, error: null, loading: true })
            this.subscribe(this.props);
        }
    }

    private subscribe(props: IProps) {
        this.authUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
            this.unsubscribeData(props);
            if (!user) {
                this.setState({ data:null, error: 'user not unauthenticated', loading: false });
            } else {
                this.subscribeData(props);
            }
        })
    }
    private unsubscribe(props: IProps) {
        this.unsubscribeData(props);
        this.authUnsubscriber();
    }

    private subscribeData(props: IProps) {
        const { path, eventName, snapSelector } = props;

        this.subscriptionCallback = (data: firebase.database.DataSnapshot) => {
            const dataVal: any = snapSelector ? snapSelector(data) : data.val();
            this.setState({ data: dataVal, error: null, loading: false });
        }

        let ref: firebase.database.Reference | firebase.database.Query = firebase.database().ref(path);

        if( this.props.orderByChild ){ ref = ref.orderByChild( this.props.orderByChild ) }
        if( this.props.orderByKey ){ ref = ref.orderByKey() }
        if( this.props.orderByPriority ){ ref = ref.orderByPriority() }
        if( this.props.orderByValue ){ ref = ref.orderByValue() }

        if( this.props.startAt ){ ref = ref.startAt( this.props.startAt ) }
        if( this.props.endAt ){ ref = ref.endAt( this.props.endAt ) }
        if( this.props.equalTo ){ ref = ref.equalTo( this.props.equalTo ) }

        if( this.props.limitToFirst ){ ref = ref.limitToFirst( this.props.limitToFirst ) }
        if( this.props.limitToLast ){ ref = ref.limitToLast( this.props.limitToLast ) }

        ref.on(eventName || 'value', this.subscriptionCallback, (error: firebase.FirebaseError) => {
            this.setState({ data: null, error, loading: false })
        })
    }
    private unsubscribeData(props: IProps) {
        const { path, eventName } = props;
        firebase.database().ref(path).off(eventName || 'value', this.subscriptionCallback);
    }

    public render() {
        return this.props.children(
            this.state.loading,
            this.state.error,
            this.state.data
            );
    }
}

