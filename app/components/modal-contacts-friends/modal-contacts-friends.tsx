import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Modal, SectionList, TouchableOpacity, View} from 'react-native';
import styles from '../../screens/settings-styles';
import { images } from '../../theme/images';
import { Text } from '../text/text';

import { Button } from '../button/button';
import { COLOR} from '../../theme';
import TextField from '../text-field/text-field';
// import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-community/clipboard';
import {notifyMessage} from '../../utils/helpers';
import {useStores} from '../../models';


type ModalContactsFriendsProps = {
  loading: boolean
  visible: boolean
  setVisible: any
  contact_list: any
}

export function ModalContactsFriends(props: ModalContactsFriendsProps) {
  const rootStore = useStores();
  const { loginStore } = rootStore;

  const [SelectedItem, setSelectedItem] = useState(null);
  const [SearchBar, setSearchBar] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [InnerModal, setInnerModal] = useState(false);
  const [SearchBarText, setSearchBarText] = useState('');
  const [ContactList, setContactList] = useState([]);
  const [ContactQuantity, setContactQuantity] = useState(0);
  const [LoadingSectionList, setLoadingSectionList] = useState(true);

  const sendInvitation = data => {
    setLoading(true);
    loginStore.environment.api.sendInvitation(data).then((result:any) => {
      setLoading(false);
      if (result.kind === 'ok') {
        notifyMessage('Invitation sent successfully', 'success');
        setInnerModal(false);
        setSelectedItem(null);
      } else {
        notifyMessage(null);
      }
    });
  };

  const renderContactsHeader = text => {
    return (
      // <LinearGradient
      //   colors={[COLOR.PALETTE.offWhite, COLOR.PALETTE.white]}
      //   style={styles.HEADER_SECTION_LIST_CONTAINER}
      //   start={{ x: 0, y: 0 }}
      //   end={{ x: 1, y: 0 }}
      //   key={'id-header-' + text}
      // >
      //   <Text style={styles.HEADER_SECTION_LIST_TEXT}>{text}</Text>
      // </LinearGradient>
        <View>
          <Text style={styles.HEADER_SECTION_LIST_TEXT}>{text}</Text>
        </View>
    );
  };

  const getContactsQuantity = () => {
    let num = 0;
    ContactList.map(contact => {
      num = num + contact.data.length;
    });
    setContactQuantity(num);
  };

  const SearchFriendInContacts = () => {
    setLoadingSectionList(true);
    const friends = [...props.contact_list];
    const result = friends.map(obj => {
      return {
        title: obj.title,
        data: obj.data.filter(data => {
          const lowerCaseName = data.name.toLowerCase();
          return lowerCaseName.includes(SearchBarText.toLowerCase());
        }),
      };
    });
    let result2 = [];
    result.map(res => {
      if (res.data.length === 0) {
        return null;
      } else {
        result2.push(res);
      }
    });
    setContactList(result2);
  };

  useEffect(() => {
    SearchFriendInContacts();
  }, [SearchBarText]);

  useEffect(() => {
    setContactList(props.contact_list);
  }, [props.contact_list]);

  useEffect(() => {
    getContactsQuantity();
    if (LoadingSectionList) {
      setTimeout(() => {
        setLoadingSectionList(false);
      }, 500);
    }
  }, [ContactList]);

  useEffect(() => {
    setSelectedItem(null);
  }, [props.visible]);

  const renderContactBody = item => {
    return (
      <View key={'itme-id-' + item.id}>
        <View style={styles.SECTION_LIST_ITEM_BODY}>
          {(item.image === null || item.image === '') && (
            <View
              style={[
                styles.SECTION_LIST_ITEM_IMAGE,
                {
                  backgroundColor: COLOR.PALETTE.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Icon name={'person'} size={20} color={COLOR.PALETTE.white} />
            </View>
          )}
          {item.image !== null && item.image !== '' && (
            <Image source={{ uri: item.image }} style={styles.SECTION_LIST_ITEM_IMAGE} />
          )}
          <Text style={styles.SECTION_LIST_ITEM_TEXT} numberOfLines={1}>
            {item.name}
          </Text>
          {!item.exists && (
            <TouchableOpacity style={styles.SECTION_LIST_ITEM_BUTTON} onPress={() => {
              setSelectedItem(item);
              setInnerModal(true);
            }}>
              <Icon name={'add'} size={15} color={COLOR.PALETTE.primary} />
              <Text style={styles.SECTION_LIST_ITEM_BUTTON_TEXT}>Invite</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.SEPARATOR, { marginHorizontal: 20, marginBottom: 0 }]} />
      </View>
    );
  };

  return (
    <Modal
      hardwareAccelerated
      animationType={'slide'}
      transparent={true}
      visible={props.visible}
      statusBarTranslucent
    >
      <View style={[styles.MODAL_BODY, { height: '86%', paddingHorizontal: 0 }]}>
        <Image source={images.fpLogo} style={styles.LOGO_MODAL} />
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text>Invite Friends</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            paddingHorizontal: 20,
            marginBottom: !SearchBar ? 10 : 0,
          }}
        >
          <Text>Contacts {ContactQuantity}</Text>
          <View style={{ flexDirection: 'row' }}>
            {SearchBar && (
              <TouchableOpacity onPress={() => setSearchBarText('')}>
                <Icon name={'clear'} size={20} color={COLOR.PALETTE.black} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setSearchBar(!SearchBar)}>
              <Icon name={'search'} size={20} color={COLOR.PALETTE.black} />
            </TouchableOpacity>
          </View>
        </View>
        {SearchBar && (
          <View style={{ marginHorizontal: 20 }}>
            <TextField
              label={'Search'}
              value={SearchBarText}
              onChangeText={txt => setSearchBarText(txt)}
              returnKeyType={'done'}
            />
          </View>
        )}
        {LoadingSectionList && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={COLOR.PALETTE.primary} />
          </View>
        )}
        {!LoadingSectionList && ContactQuantity > 0 && (
          <SectionList
            sections={ContactList}
            stickySectionHeadersEnabled
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => renderContactBody(item)}
            renderSectionHeader={({ section: { title } }) => renderContactsHeader(title)}
          />
        )}
        {ContactQuantity === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: COLOR.PALETTE.black }}>No contacts found</Text>
          </View>
        )}
        <Button
          text={'CANCEL'}
          style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 10 }}
          preset={'secondary'}
          onPress={() => {
            props.setVisible(false);
            setSearchBarText('');
          }}
        />
        <Modal
          hardwareAccelerated
          animationType={'slide'}
          transparent={true}
          visible={InnerModal}
          statusBarTranslucent
          onRequestClose={() => {
            setInnerModal(false);
          }}
        >
          <View style={[styles.MODAL_BODY, { height: '70%', paddingHorizontal: 0 }]}>
            <Image source={images.fpLogo} style={styles.LOGO_MODAL} />
            <View style={[styles.FIRST_TITLE_MODAL, {marginBottom: 10}]}>
              {/*<TouchableOpacity style={{position: "absolute", right: -100, top: -50}} onPress={() => setInnerModal(false)}>*/}
              {/*  <Icon name={"close"} size={30} color={COLOR.PALETTE.black} />*/}
              {/*</TouchableOpacity>*/}
              <Text>Invite to Finplan</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {SelectedItem && !SelectedItem.image && (
                <View
                  style={[
                    styles.SECTION_LIST_ITEM_IMAGE,
                    {
                      backgroundColor: COLOR.PALETTE.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    },
                  ]}
                >
                  <Icon name={'person'} size={30} color={COLOR.PALETTE.white} />
                </View>
              )}
              {SelectedItem && SelectedItem.image && (
                <Image source={{ uri: SelectedItem.image }} style={[styles.SECTION_LIST_ITEM_IMAGE, {height: 50, width: 50, borderRadius: 25}]} />
              )}
              <View style={{marginLeft: 10, marginBottom: 10}}>
                <Text style={{width: 250, marginBottom:5}} numberOfLines={1}>Name: {SelectedItem && SelectedItem.name}</Text>
                <Text style={{width: 250, marginBottom:5}} numberOfLines={1}>Phone number: {SelectedItem && SelectedItem.phone_number}</Text>
                <Text style={{width: 250, marginBottom:5}} numberOfLines={1}>Email: {SelectedItem && SelectedItem.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString('https://timothy-mbakwe-29525.botics.co/');
                notifyMessage('Link copied successfully', 'success');
              }}
              style={styles.MODAL_INVITE_FRIENDS}
            >
              <Text style={styles.MODAL_INVITE_FRIENDS_TEXT}>COPY LINK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.MODAL_INVITE_FRIENDS, {borderColor: (SelectedItem && SelectedItem.phone_number === null) ? COLOR.PALETTE.primaryDisabled : COLOR.PALETTE.primary }]}
              disabled={SelectedItem && SelectedItem.phone_number === null}
            >
              <Text style={[styles.MODAL_INVITE_FRIENDS_TEXT, {color: (SelectedItem && SelectedItem.phone_number === null) ? COLOR.PALETTE.primaryDisabled : COLOR.PALETTE.primary }]}>SEND A SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendInvitation(SelectedItem)}
              disabled={(SelectedItem && SelectedItem.email === null) || Loading}
              style={[styles.MODAL_INVITE_FRIENDS, {borderColor: (SelectedItem && SelectedItem.email === null) ? COLOR.PALETTE.primaryDisabled : COLOR.PALETTE.primary }]}
            >
              <Text style={[styles.MODAL_INVITE_FRIENDS_TEXT, {color: (SelectedItem && SelectedItem.email === null) ? COLOR.PALETTE.primaryDisabled : COLOR.PALETTE.primary }]}>SEND AN EMAIL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setInnerModal(false)}
              style={[styles.MODAL_INVITE_FRIENDS, {borderColor: COLOR.PALETTE.black}]}
            >
              <Text style={[styles.MODAL_INVITE_FRIENDS_TEXT, {color: COLOR.PALETTE.black}]}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
