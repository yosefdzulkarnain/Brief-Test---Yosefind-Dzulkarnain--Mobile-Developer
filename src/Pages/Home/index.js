import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {banner1, mic, search} from '../../Assets';
import axios from 'axios';

const Home = () => {
  const [result, setResult] = useState('');
  const [imgActive, setImgActive] = useState(0);
  const [valueBanner, setValueBanner] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    DataBanner();
    DataKategori();
    DataProduk();
  }, []);

  onchange = nativeEvent => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };

  const DataBanner = () => {
    axios
      .get(
        'https://gardien.tokodistributor.co.id/api-web/v2/utility/home/banner-web',
      )
      .then(res => {
        console.log('res:', res.data.data);
        setValueBanner(res.data.data);
      });
  };

  const DataKategori = () => {
    axios
      .get(
        'https://gardien.tokodistributor.co.id/api-web/v2/utility/home/box-category?with_staple=true',
      )
      .then(res => {
        console.log('res:', res.data.data);
        setKategori(res.data.data);
      });
  };

  const DataProduk = () => {
    axios
      .get(
        'https://gardien.tokodistributor.co.id/api-web/v2/product-recommendation?page=1',
      )
      .then(res => {
        console.log('res:', res.data.data);
        setProduk(res.data.data);
      });
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = e => {
    console.log('Start Hendler =====', e);
  };

  const onSpeechEndHandler = e => {
    console.log('End Hendler =====', e);
  };

  const onSpeechResultsHandler = e => {
    console.log('Result Hendler =====', e);
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-Us');
    } catch (e) {
      console.log('start voice >>>>>', e);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop;
    } catch (e) {
      console.log('end voice >>>>>', e);
    }
  };

  const ItemB = ({situs}) => {
    return (
      <Image
        resizeMode="stretch"
        style={styles.bannerItem}
        source={{uri: `${situs}`}}
      />
    );
  };

  const Icon = ({onPress, title, itemIcon}) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.wrapItem}>
          <View style={{backgroundColor: '#EEEEEE', borderRadius: 5}}>
            <Image source={{uri: `${itemIcon}`}} style={styles.buttonIcon} />
          </View>
          <Text style={styles.textIcon}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Product = ({iconProduk, descProduk, descPrice, onPress}) => {
    var bilangan = descPrice;

    var reverse = bilangan.toString().split('').reverse().join(''),
      ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.wrapProduk}>
          <Image source={{uri: `${iconProduk}`}} style={styles.ItemProduct} />
          <Text style={styles.textProduk}>{descProduk}</Text>
          <View style={{flexDirection: 'row'}}>

          <Text style={styles.textPrice}>Rp</Text>
          <Text style={styles.textPriceBold}>{ribuan}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /*   expect(toRupiah(50000, {floatingPoint: 0})).toBe('Rp50.000'); */
  return (
    <SafeAreaView style={styles.baseSTY}>
      <View style={styles.searchbarSTY}>
        <View style={styles.same}>
          <Image source={search} style={styles.imgSearch} />
          <TextInput
            value={result}
            placeholder="Jam Tangan"
            onChangeText={text => setResult(text)}
          />
        </View>
        <TouchableOpacity onPress={startRecording}>
          <Image source={mic} style={styles.imgMIC} />
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView
          onScroll={({nativeEvent}) => onchange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={styles.wrapBanner}>
          {valueBanner.map((vb, key) => (
            <ItemB key={key} situs={vb.url_mobile} />
          ))}
        </ScrollView>
        <View style={styles.wrapDot}>
          {valueBanner.map((vb, index) => (
            <Text
              key={index}
              style={imgActive == index ? styles.dotActive : styles.dot}>
              ●
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.kategoriSTY}>
        <ScrollView horizontal style={styles.wrapIcon}>
          {kategori.map((item, key) => (
            <Icon key={key} title={item.category_name} itemIcon={item.icon} />
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          shadowColor: '#000',
          backgroundColor: '#565455',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
          height: 2,
          marginTop: windowHeight * 0.01,
        }}></View>

      <View style={styles.kategoriProd}>
        <ScrollView horizontal>
          <View style={styles.wrapKategori}>
            {produk.map((prod, key) => (
              <Product
                key={key}
                iconProduk={prod.image_uri}
                descProduk={prod.product_name}
                descPrice={prod.normal_price}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  searchbarSTY: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.04,
    width: windowWidth * 0.85,
    paddingHorizontal: windowWidth * 0.03,
    borderRadius: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  textPrice: {
    fontSize: 12
  },
  textPriceBold: {
    fontWeight: 'bold',
    fontSize: 16
  },
  wrapProduk: {
    height: windowHeight * 0.142,
    width: windowWidth * 0.315,
    margin: windowHeight * 0.003,
    borderRadius: windowWidth * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  ItemProduct: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.1,
    resizeMode: 'stretch',
    borderRadius: windowWidth*0.01
  },
  wrapItem: {
    width: windowWidth * 0.2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  kategoriSTY: {
    marginTop: windowHeight * 0.02,
  },
  kategoriProd: {
    marginTop: windowHeight * 0.02,
    flex: 1,
    paddingTop: windowHeight*0.005
  },
  wrapIcon: {
    flexDirection: 'row',
    paddingHorizontal: windowHeight * 0.005,
  },
  wrapKategori: {
    flexDirection: 'row',
    paddingHorizontal: windowHeight * 0.005,
    width: windowWidth * 3.309,
    flexWrap: 'wrap',
    paddingHorizontal: windowWidth*0.01
  },
  textIcon: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'TitilliumWeb-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingTop: 5,
  },
  buttonIcon: {
    width: windowHeight * 0.06,
    height: windowHeight * 0.06,
    borderRadius: windowHeight * 0.001,
  },
  bannerItem: {
    height: windowHeight * 0.23,
    width: windowWidth,
    resizeMode: 'stretch',
  },
  wrapBanner: {
    height: windowHeight * 0.23,
    marginTop: windowHeight * 0.03,
    width: windowWidth,
  },
  baseSTY: {
    backgroundColor: '#928F8F',
    flex: 1,
  },
  same: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgMIC: {
    width: 23,
    height: 23,
  },
  imgSearch: {
    width: 23,
    height: 23,
    marginRight: windowWidth * 0.015,
  },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'black',
  },
  dot: {
    margin: 3,
    color: 'white',
  },
  textProduk: {
    fontSize: 16,
    color: 'black',
    height: windowHeight*0.02,
    textAlign: 'center'
  },
});
