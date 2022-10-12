import React, { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from "react-native"
import { Text, Button, Screen, TextInputComponent } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
// import styles from "./where-spend-style"
import styles from "./where-spend"
import { COLOR, IMAGES, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useStores } from "../../models"
import { CheckBox } from 'react-native-elements'
import MapView, { Marker, Circle } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

const industryTypes = [
  {
    type: 'Arts & entertainment',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
    ]
  },
  {
    type: 'Communication & education',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
    ]
  },
  {
    type: 'Food & drink',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      },
    ]
  },
  {
    type: 'Health & wellness',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      }
    ]
  },
  {
    type: 'Lodging',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      }
    ]
  },
  {
    type: 'Shopping',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      }
    ]
  },
  {
    type: 'Services',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
        description: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
        location: '',
        website: 'link',
        facebook: 'link',
        instagram: 'link',
        twitter: 'link',
        active_cupons: [
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },

          {
            image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
            label: 'cupom exaple'
          },
        ]
      }
    ]
  },
]

export const WhereSpendScreen = observer(function WhereSpendScreen() {
  const rootStore = useStores()
  const navigation = useNavigation()
  const { loginStore } = rootStore
  const [Search, setSearch] = useState('')
  const [ShowDetail, setShowDetail] = useState(false)
  const [SelectedDetail, setSelectedDetail] = useState<any>({})
  const [ShowMap, setShowMap] = useState(false)
  const [Location, setLocation] = useState('')
  const [DistanceFilter, setDistanceFilter] = useState(10)
  const [ShowFilter, setShowFilter] = useState(false)
  const [Region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.215,
    longitudeDelta: 0.3121,
  })
  const [Latitud, setLatitud] = useState(null)
  const [Longitud, setLongitud] = useState(null)

  const getBusiness = () => {
    loginStore.environment.api
      .getBusiness()
      .then((result: any) => {
        console.log(' getBusiness ===>>> ', JSON.stringify(result, null, 2))
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setBusiness(result.data?.merchants)
            loginStore.setMerchantMonth(result.data?.merchant_month)
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          const msg = `${key}: ${result?.errors?.[key][0]}`
          notifyMessage(msg)
        } else {
          notifyMessage(null)
        }
      })
  }

  useEffect(() => {
    getBusiness()
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const location = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }
        setRegion(location)
        setLatitud(location.latitude)
        setLongitud(location.longitude)
      },
      console.warn,
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    )
  }, [])

  const RenderTopMonth = () => {
    const merchantOfTheMonth = loginStore.getMerchantOfMonth
    return (
      <View style={styles.INDUSTRY_CONTAINER}>
        <Text style={styles.INDUSTRY_TITLE}>MERCHANT OF THE MONTH</Text>
        <View style={styles.LINE} />
        <TouchableOpacity onPress={() => [setShowDetail(true), setSelectedDetail(merchantOfTheMonth)]} style={styles.BUSINESS_CONTAINER}>
          <View style={styles.TOP_MONTH}>
            <Text style={styles.MONTH_BUSINESS_NAME}>{merchantOfTheMonth.business_name}</Text>
            <Text style={styles.MONTH_BUSINESS_ABOUT}>{merchantOfTheMonth.business_story}</Text>
          </View>
          <Image
            source={{ uri: merchantOfTheMonth.image }}
            resizeMode='cover'
            style={styles.MONTH_BUSINESS_IMAGE}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const getBusinessDetail = (id) => {
    setShowDetail(true)
    loginStore.environment.api
      .getBusinessDetail(id)
      .then((result: any) => {
        console.log(' getBusinessDetail ===>>> ', JSON.stringify(result, null, 2))
        if (result.kind === "ok") {
          runInAction(() => {
            let busDet = loginStore.getBusinessDetail
            busDet[id] = result.data
            loginStore.setBusinessDetails(busDet)
            setSelectedDetail(result.data)
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          const msg = `${key}: ${result?.errors?.[key][0]}`
          setShowDetail(false)
          notifyMessage(msg)
        } else {
          setShowDetail(false)
          notifyMessage(null)
        }
      })

  }

  const RenderCategories = () => {
    console.log(' business => ', JSON.stringify(loginStore.getBusiness, null, 2))
    return (
      Object.keys(loginStore.getBusiness[0]).map((i, key) => (
        <View style={styles.INDUSTRY_CONTAINER} key={key + '_industry'}>
          <Text style={styles.INDUSTRY_TITLE}>{i}</Text>
          <View style={styles.LINE} />
          <ScrollView horizontal style={styles.BUSINESS_CONTAINER}>
            {loginStore.getBusiness[0][i].map((b, key2) => (
              <TouchableOpacity onPress={() => getBusinessDetail(b.id)} style={styles.BUSINESS} key={key + '' + key2}>
                <Image
                  source={{ uri: b.background_picture }}
                  resizeMode='cover'
                  style={styles.BUSINESS_IMAGE}
                />
                <Text style={styles.BUSINESS_NAME}>{b.business_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))
    )
  }

  const Filters = () => <View style={styles.FILTER_CONTAINER}>
    <Text style={styles.DISTANCE_FILTER_LABEL}>Distance</Text>
    <View style={styles.DISTANCES_CONTAINER}>
      <CheckBox
        checked={DistanceFilter === 1}
        onPress={() => setDistanceFilter(1)}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>1 mi</Text>
      <CheckBox
        checked={DistanceFilter === 5}
        onPress={() => setDistanceFilter(5)}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>5 mi</Text>
      <CheckBox
        checked={DistanceFilter === 10}
        onPress={() => setDistanceFilter(10)}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>10 mi</Text>
    </View>
    <TextInputComponent
      label='Distance'
      onChangeText={t => setDistanceFilter(t.replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
      value={`${DistanceFilter}`}
      placeholder={"Custom distance"}
      labelContainerStyle={{ display: 'none' }}
    />
    <Text
      onPress={() => [setShowMap(true), setShowFilter(false)]}
      style={[styles.FIND_MAP, { color: loginStore.getAccountColor }]}
    >Find Location on Google Maps</Text>
    <Text style={styles.CLEAR_FILTERS}>Clear filters</Text>
    <View style={styles.LINE} />
  </View>

  const MapContainer = () =>
    <View style={styles.ROOT_CONTAINER}>
      <View style={styles.CONTAINER}>
        <TouchableOpacity style={styles.HEADER} onPress={() => setShowMap(false)}>
          <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
          <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
        </TouchableOpacity>

        <TextInputComponent
          label='Location'
          onChangeText={t => setLocation(t)}
          value={Location}
          placeholder={"Enter Location"}
        />
        <Button
          buttonStyle={{
            backgroundColor: COLOR.PALETTE.blue,
            width: METRICS.screenWidth * 0.8,
            marginTop: 20,

          }}
          onPress={() => { }}
          buttonLabel={'Confirm Location'}

        />

      </View>
      <MapView
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          // height: METRICS.screenHeight - 200,
          flex: 1,
          width: METRICS.screenWidth,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        showsUserLocation
        loadingEnabled
        zoomEnabled
        zoomControlEnabled
        initialRegion={Region}
      >
        <Circle
          center={{
            latitude: Region.latitude,
            longitude: Region.longitude
          }}
          // radius={(DistanceFilter * 1609.34)}
          radius={(DistanceFilter * 1000)}
          strokeColor={'#800000'}
          strokeOpacity={1.0}
          strokeWeight={1}
          fillColor={'rgba(0,0,0,0.2)'}
          fillOpacity={0.5}

        />
      </MapView>
    </View>

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      {ShowMap
        ? MapContainer()
        :
        <View style={styles.ROOT_CONTAINER}>
          {ShowDetail
            ? <TouchableOpacity style={styles.HEADER} onPress={() => [setShowDetail(false), setSelectedDetail({})]}>
              <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
              <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("home")}>
              <Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
              <Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
            </TouchableOpacity>
          }
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {ShowDetail
              ? <View style={styles.CONTAINER}>
                <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>{SelectedDetail?.business_name}</Text>
                <View style={styles.LINE} />
                <View style={styles.NEWS_CONTAINER}>
                  <Text style={styles.NEWS_TITLE}>{SelectedDetail?.business_name}</Text>
                  <Text style={styles.NEWS_BODY}>{SelectedDetail?.business_story}</Text>
                  <Image
                    source={{ uri: SelectedDetail?.background_picture }}
                    resizeMode='cover'
                    style={styles.NEWS_IMAGE}
                  />
                  <View style={styles.DETAIL_LINKS}>
                    {console.log(' selected detail => ', SelectedDetail)}
                    {SelectedDetail.website &&
                      <MaterialCommunityIcons
                        name={"web"}
                        size={25}
                        color={"black"}
                        style={{ marginRight: 8 }}
                      />
                    }
                    {SelectedDetail.facebook &&
                      <FontAwesome
                        name={"facebook"}
                        size={25}
                        color={"black"}
                        style={{ marginRight: 8 }}
                      />
                    }
                    {SelectedDetail.twitter &&
                      <FontAwesome
                        name={"twitter"}
                        size={25}
                        color={"black"}
                        style={{ marginRight: 8 }}
                      />
                    }
                    {SelectedDetail.instagram &&
                      <FontAwesome
                        name={"instagram"}
                        size={25}
                        color={"black"}
                        style={{ marginRight: 8 }}
                      />
                    }
                    <Text style={styles.SEE_ON_MAP_LABEL}>SHOW ON MAP</Text>
                  </View>
                </View>
                <View style={styles.INDUSTRY_CONTAINER}>
                  <Text style={styles.INDUSTRY_TITLE}>ALL ACTIVE COUPONS</Text>
                  <View style={styles.LINE} />
                  <ScrollView horizontal style={styles.BUSINESS_CONTAINER}>
                    {SelectedDetail?.coupons && SelectedDetail?.coupons.map((b, key2) => (
                      <View style={styles.BUSINESS} key={key2 + '_coupon'}>
                        <Image
                          source={{ uri: b.promo_image }}
                          resizeMode='cover'
                          style={styles.BUSINESS_IMAGE}
                        />
                        <Text style={styles.BUSINESS_NAME}>{b.title}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
              : <View style={styles.CONTAINER}>
                <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>{'Where to spend'}</Text>
                <View style={styles.LINE} />
                <Text style={styles.STEP_SUB_TITLE}>We are here to help you with anything and everything on the Currents app.</Text>
                <View style={styles.SEARCH_INPUT_CONTAINER}>
                  <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
                    <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
                    <TextInput
                      style={styles.SEARCH_INPUT_STYLE}
                      onChangeText={t => setSearch(t)}
                      value={Search}
                      placeholder={`Search`}
                    />
                  </View>
                  <TouchableOpacity style={styles.SEARCH_INPUT_ADJUSTMENTS} onPress={() => setShowFilter(!ShowFilter)}>
                    <Image source={IMAGES.shortIcon} resizeMode='contain' style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
                {ShowFilter && Filters()}
                {RenderTopMonth()}
                {RenderCategories()}
                {RenderCategories()}
                {RenderCategories()}
                {RenderCategories()}
                {RenderCategories()}
              </View>
            }
          </ScrollView>
        </View>
      }
      <Button
        // onPress={() => {}}
        buttonLabel={''}
        hideButton
        showBottonMenu={false}
        accountType={loginStore.getSelectedAccount}
      />
    </Screen>
  )
})
