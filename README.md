## **ALMS+**

------

Alms+ react native mobil uygalaması

### **İçindekiler**

------

- [Genel bakış](###genel-bakis)
- [Uygulamayı Çalıştırma](###uygulamayi-calistirma)
- [Uygulama Mimarisi](###uygulama-mimarisi)
- [Dizin Yapısı](###dizin-yapisi)
- [Gerekli Açıklamalar](###gerekli-aciklamalar)
- [Bilinen Sorunlar](###bilinen-sorunlar)
- [Kullanılan Kütüphaneler](###kullanilan-kutuphaneler)



### Genel Bakış

------



### Uygulamayı Çalıştırma

------

Uygulamayı çalıştırmak için;

Node.js yüklü olması gerekir. [Node.js](https://nodejs.org/en/)

`npm install` komutu ile kullanılan paket ve kütüphanelerin yüklenmesi sağlanır.

Platform : **Android**

1. Fiziksel bir cihazda test etmek için telefonun bilgisayara bağlı ve geliştirici seçeneklerin açık olması gerekir. 
2. Uygulama dizini içerisindeyken `react-native run-android` komutu ile uygulama çalıştırılabilir.

Platform: **IOS**

Sanal ve fiziksel cihazda test etmek için Xcode'a ihtiyaç duyulur. 

Sanal cihazda çalıştırmak için Xcode üzerinden kullanılmak istenilen simulator seçilir. Ardından `react-native run-ios` komutu ile sanal cihaz çalıştırilıp uygulama yüklenir.

Fiziksel cihazda çalıştırmak için İOS cihazı bilgisayara bağladıktan sonra Xcode menübar'dan destination kısmına bağlı cihazınızı seçin, ardından Build and Run butonuyla uygulama çalıştırılır.



### Uygulama Mimarisi

------

State management için redux ve api çağrılarını yönetmek için saga mimarileri kullanılmıştır. Uygulama genel yapıları modüllere ayrılmış ve state'ler bu modüller üzerinden yönetilmiştir. Modüler bir yapı oluşturulmuştur. 

![redux-saga-architecture](https://bitbucket.org/ayalcin/advancity_alms-reactnative/raw/29fb088838f67fee3f2abdce931d9985f7208648/art/redux-saga-architecture.png)



### Dizin Yapısı

------

Uygulama hangi dosyalar üzerinden çalıştırılıyor?

1. Uygulama çalıştırıldığında index.js üzerinden çalışır ve App.js yönlendirilir.
2. App.js  kullanıcının giriş yapıp yapmadığına göre ve cihazın tablet/telefon durumuna göre navigation dizinine yönlendirir. 
3. login modülü ve app modülü için iki ayrı container bulunmaktadır. Giriş yapmamış bir kullanıcı login modüle yönlendirilir. Giriş yaptıktan sonra ana modüle yönlendirilir. 

```
Alms
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── App.js
├── Android
├── ios
└── App
    └── assets
        ├── fonts
        ├── icons
        ├── images
    └── components
        ├── announcement
        ├── courses
        ├── messages
        ├── notes
        ├── organization
        ├── schedule
    └── helpers
    └── local
    └── locales
    └── native
    └── navigation
    └── redux
    └── sagas
    └── services
    └── theme
    └── views
        ├── drawer
        ├── login
        ├── tabs
```

Genel dizin yapısı içerikleri olmadan yukarıdaki gibidir.

**Assets Dizini:**  Bu dizinde android ve ios için tanımlanan fontlar ve uygulama içerisinde kullanılan resimler bulunur.

**Components Dizini:** Uygulama içerisinde tekrar kullanılabilecek kısımları component haline getirilip bu dizin içerisine konulmuştur. 

**Helpers Dizini:** Yardımcı componentleri içeren dizindir.

**Locales Dizini:**  Uygulama dil desteği için gerekli olan string'leri içerir. Api tarafından uygulama gelmeyen çeviriler olduğu durumda bu dizin içerisindeki çeviriler kullanılır.

**Native Dizini:**  Push notification için yazılan native metodları kullanabilmemiz için gerekli olan modüller tanımlanmıştır.

**Navigation Dizini:**  Telefon ve tablet için navigasyon yapısını oluşturan dizindir.

**Redux Dizini:**  State modülleriyle beraber action tanımlarını içerir. 

**Sagas Dizini:** View tarafından gelen action'lara göre api çağrımlarını yapıldığı ve api'den gelen cevapları yine state reducer'lara gönderildiği metodların içermektedir.

**Services Dizini:** Api çağrıların yapıldığı metodları barındırır.

**Theme Dizini:** Görsel değişikler için kullanılan sabitleri tutar.

**Views Dizini:** Kullanıcıya gösterilen ekranlar bu dizinde bulunmaktadır. 





### Gerekli Açıklamalar

------

**Navigasyon Yapısı :** Uygulama tablet ve telefon cihazları için geliştirdi. Tablet cihazlarda menü seçenekleri farklı olduğundan navigasyon sistemi farklı iki ayrı dosyadan yönetilmektedir. Telefonlar için *Router.js* , tabletler için *RouterTablet.js* dosyaları üzerinden yönlendirmeler yapılmaktadır.  Ders detaylarına girdiğinde farklı bir tab menü ye sahip olduğundan yönlendirme detay kısmında *CourseDetailTabMenu.js* dosyasına devredilir. 

**Native Modüller:** Push notification token'ları oluşturmak için Java-Swift kodu yazılması gerekmiştir. Oluşturulan token'ları kullanıcı bilgileriyle birlikte servislere gönderilebilmesi için native modüllerinden faydalanılmıştır. Bu modüller yazılan java ve swift metotlarına javascripty tarafından gönderilen kullanıcı bilgileriyle beraber token'ı servise gönderir. Metod isimleri

- userData(userId,companyId) =>Android
- registerPushNotifications(userId,companyId) = >Ios

**Offline Mode:** Kullanıcıların sadece görüntüledikleri sayfalar internet olmadan da kullanabilmesini sağlamak için uygulama cache'inde tutulmaktadır. İndirilen içerikler ilgili dersin detay kısmında Dosyalar tab ında bulunulur ve uygulama içerisinde depolanır. 



### Bilinen Sorunlar

------

1. Webview'de açılacak activite detayları link'ler hazır olmadığından boş ekran olarak geliyor. 
2. Mesajlarda kullanılan apilerde sayfalama için gönderilen parametrelerle alakalı sorun olduğundan sayfalama çalışmıyor. (Uygulama sayfalamaya uygun şekilde geliştirilmiştir.)

### Kullanılan Bazı Kütüphaneler

------

1. @react-native-community/async-storage : Offline mode için veri depolamasını sağlar.
2. react-native-device-info : Cihazın tablet/telefon olarak belirlenmesi için kullanılır.
3. @react-native-community/netinfo: İnternet durumunu kontrol etmek için kullanılır.
4. react-native-document-picker : Ödevlere dosya yükleme, yeni döküman aktivitesi oluşturma veya duyurulara döküman ekleme işlemlerin telefon hafızasındaki dosyalara erişim için kullanılır.
5. seamless-immutable : State'leri birleştirmek için kullanılır.
6. rn-fetch-blob : Dosya yükleme ve indirme işlemlerinde kullanılır.


Android apk,bundle imzalama icin app-> android> keystores >alms-key.keystore dosyasi kullanilir. Keystore bilgileri ; 

Keytool Password: key@advancity
Alias: Alms
Alias Password: Alms@advancity
