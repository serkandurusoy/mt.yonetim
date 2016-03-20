Meteor.startup(function () {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.Dersler.find().count() === 0 && M.C.Muhurler.find().count() === 0 && M.C.Mufredat.find().count() === 0) {
    var dersler = [
      {
        ders: 'Matematik',
        isim: 'Şaman',
        slug: 'saman',
        muhurler: [
          {isim: 'Aba', slugYeni: 'aba', seviye: 'gumus', slug: 'aslan'},
          {isim: 'Başgu', slugYeni: 'basgu', seviye: 'gumus', slug: 'at'},
          {isim: 'Abar', slugYeni: 'abar', seviye: 'gumus', slug: 'ayi'},
          {isim: 'Kınık', slugYeni: 'kinik', seviye: 'gumus', slug: 'deve'},
          {isim: 'Böken', slugYeni: 'boken', seviye: 'gumus', slug: 'geyik'},
          {isim: 'İlgik', slugYeni: 'ilgik', seviye: 'gumus', slug: 'kaplumbaga'},
          {isim: 'Çora', slugYeni: 'cora', seviye: 'gumus', slug: 'kirpi'},
          {isim: 'Asena', slugYeni: 'asena', seviye: 'gumus', slug: 'kurt'},
          {isim: 'Cumuk', slugYeni: 'cumuk', seviye: 'gumus', slug: 'tavsan'},
          {isim: 'Tulki', slugYeni: 'tulki', seviye: 'gumus', slug: 'tilki'},
          {isim: 'Erki', slugYeni: 'erki', seviye: 'altin', slug: 'aslan'},
          {isim: 'Adkır', slugYeni: 'adkir', seviye: 'altin', slug: 'at'},
          {isim: 'Çaktu', slugYeni: 'caktu', seviye: 'altin', slug: 'ayi'},
          {isim: 'Buğrak', slugYeni: 'bugrak', seviye: 'altin', slug: 'deve'},
          {isim: 'Ağalak', slugYeni: 'agalak', seviye: 'altin', slug: 'geyik'},
          {isim: 'Baçak', slugYeni: 'bacak', seviye: 'altin', slug: 'kaplumbaga'},
          {isim: 'Gicik', slugYeni: 'gicik', seviye: 'altin', slug: 'kirpi'},
          {isim: 'Börü', slugYeni: 'boru', seviye: 'altin', slug: 'kurt'},
          {isim: 'Tavışgan', slugYeni: 'tavisgan', seviye: 'altin', slug: 'tavsan'},
          {isim: 'Eçe', slugYeni: 'ece', seviye: 'altin', slug: 'tilki'}
        ],
        mufredat: [
          {
            sinif: '05',
            konular: [
              {
                konu: '01.01 Sayılar ve İşlemler / Doğal Sayılar',
                kazanimlar: [
                  '01.01.01 En çok dokuz basamaklı doğal sayıları okur ve yazar.',
                  '01.01.02 En çok dokuz basamaklı doğal sayıların bölüklerini, basamaklarını ve rakamların basamak değerlerini belirtir.',
                  '01.01.03 Kuralı verilen sayı ve şekil örüntülerinin istenen adımlarını oluşturur.'
                ]
              },
              {
                konu: '01.02 Sayılar ve İşlemler / Doğal Sayılarla İşlemler',
                kazanimlar: [
                  '01.02.01 En çok beş basamaklı doğal sayılarla toplama ve çıkarma işlemi yapar.',
                  '01.02.02 İki basamaklı doğal sayılarla zihinden toplama ve çıkarma işlemlerinde uygun stratejiyi seçerek kullanır.',
                  '01.02.03 Doğal sayılarla toplama ve çıkarma işlemlerinin sonuçlarını tahmin eder.',
                  '01.02.04 En çok üç basamaklı iki doğal sayının çarpma işlemini yapar.',
                  '01.02.05 En çok dört basamaklı bir doğal sayıyı, en çok iki basamaklı bir doğal sayıya böler.',
                  '01.02.06 Doğal sayılarla çarpma ve bölme işlemlerinin sonuçlarını tahmin eder.',
                  '01.02.07 Doğal sayılarla zihinden çarpma ve bölme işlemlerinde uygun stratejiyi seçerek kullanır.',
                  '01.02.08 Bölme işlemine ilişkin problem durumlarında kalanı yorumlar.',
                  '01.02.09 Çarpma ve bölme işlemleri arasındaki ilişkiyi anlayarak işlemlerde verilmeyen öğeleri (çarpan, bölüm veya bölünen) bulur.',
                  '01.02.10 Dört işlem içeren problemleri çözer.',
                  '01.02.11 Bir doğal sayının karesi ve küpünü üslü olarak gösterir; değerini bulur.',
                  '01.02.12 En çok iki işlem içeren parantezli ifadelerin sonucunu bulur.'
                ]
              },
              {
                konu: '01.03 Sayılar ve İşlemler / Kesirler',
                kazanimlar: [
                  '01.03.01 Birim kesirleri sıralar.',
                  '01.03.02 Birim kesirleri sayı doğrusunda gösterir.',
                  '01.03.03 Tam sayılı kesrin, bir doğal sayı ile bir basit kesrin toplamı olduğunu anlar ve tam sayılı kesri bileşik kesre, bileşik kesri tam sayılı kesre dönüştürür.',
                  '01.03.04 Bir doğal sayı ile bir bileşik kesri karşılaştırır.',
                  '01.03.05 Sadeleştirme ve genişletmenin kesrin değerini değiştirmeyeceğini anlar ve bir kesre denk olan kesirler oluşturur.',
                  '01.03.06 Paydaları eşit veya birinin paydası diğerinin katı olan kesirleri sıralar.',
                  '01.03.07 Basit kesir kadarı verilen bir çokluğun tamamını birim kesirlerden yararlanarak hesaplar.',
                  '01.03.08 Bir çokluğun istenen basit kesir kadarını birim kesirlerden yararlanarak hesaplar.'
                ]
              },
              {
                konu: '01.04 Sayılar ve İşlemler / Kesirlerle İşlemler: Toplama ve Çıkarma',
                kazanimlar: [
                  '01.04.01 Paydaları eşit veya birinin paydası diğerinin katı olan iki kesrin toplama ve çıkarma işlemini yapar ve anlamlandırır.',
                  '01.04.02 Paydaları eşit veya birinin paydası diğerinin katı olan kesirlerle toplama ve çıkarma işlemleri gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '01.05 Sayılar ve İşlemler / Ondalık Gösterim',
                kazanimlar: [
                  '01.05.01 Ondalık gösterimlerin kesirlerin farklı bir ifadesi olduğunu fark eder ve paydası 10, 100 ve 1000 olacak şekilde genişletilebilen veya sadeleştirilebilen kesirlerin ondalık gösterimini yazar ve okur.',
                  '01.05.02 Ondalık gösterimde virgülün işlevini, virgülden önceki ve sonraki rakamların konumlarının basamak değeriyle ilişkisini anlar; ondalık gösterimdeki basamak adlarını belirtir.',
                  '01.05.03 Ondalık gösterimleri verilen sayıları sıralar.',
                  '01.05.04 Ondalık gösterimleri verilen sayıları sayı doğrusunda gösterir.',
                  '01.05.05 Ondalık gösterimleri verilen sayılarla toplama ve çıkarma işlemleri yapar.'
                ]
              },
              {
                konu: '01.06 Sayılar ve İşlemler / Yüzdeler',
                kazanimlar: [
                  '01.06.01 Paydası 100 olan kesirleri yüzde sembolü (%) ile gösterir.',
                  '01.06.02 Bir yüzdelik ifadeyi aynı büyüklüğü temsil eden kesir ve ondalık gösterimle ilişkilendirir; bu gösterimleri birbirine dönüştürür.',
                  '01.06.03 Kesir, ondalık ve yüzdelik gösterimle belirtilen çoklukları karşılaştırır.',
                  '01.06.04 Bir çokluğun belirtilen bir yüzdesine karşılık gelen miktarı bulur.'
                ]
              },
              {
                konu: '02.01 Geometri ve Ölçme / Temel Geometrik Kavramlar ve Çizimler',
                kazanimlar: [
                  '02.01.01 Doğru, doğru parçası ve ışını açıklar ve sembolle gösterir.',
                  '02.01.02 Kareli veya noktalı kâğıt üzerinde bir noktanın diğer bir noktaya göre konumunu yön ve birim kullanarak ifade eder.',
                  '02.01.03 Kareli veya noktalı kâğıt üzerinde bir doğru parçasına eşit uzunlukta doğru parçaları çizer.',
                  '02.01.04 Kareli veya noktalı kâğıt üzerinde bir doğru parçasına paralel doğru parçaları inşa eder; çizilmiş doğru parçalarının paralel olup olmadığını yorumlar.',
                  '02.01.05 Kareli veya noktalı kâğıt üzerinde 90°’lik bir açıyı referans alarak dar, dik ve geniş açıları oluşturur; oluşturulmuş bir açının dar, dik ya da geniş açılı olduğunu belirler.'
                ]
              },
              {
                konu: '02.02 Geometri ve Ölçme / Üçgen ve Dörtgenler',
                kazanimlar: [
                  '02.02.01 Çokgenleri isimlendirir, oluşturur ve temel elemanlarından kenar, iç açı, köşe ve köşegeni tanır.',
                  '02.02.02 Kareli, noktalı ya da izometrik kâğıtlardan uygun olanlarını kullanarak açılarına göre ve kenarlarına göre üçgenler oluşturur; oluşturulmuş farklı üçgenleri kenar ve açı özelliklerine göre sınıflandırır.',
                  '02.02.03 Dikdörtgen, paralelkenar, eşkenar dörtgen ve yamuğun temel özelliklerini anlar.',
                  '02.02.04 Dikdörtgen, paralelkenar, eşkenar dörtgen ve yamuğu kareli veya noktalı kâğıt üzerinde çizer; oluşturulanların hangi şekil olduğunu belirler.',
                  '02.02.05 Üçgen ve dörtgenlerin iç açılarının ölçüleri toplamını belirler ve verilmeyen açıyı bulur.'
                ]
              },
              {
                konu: '02.03 Geometri ve Ölçme / Uzunluk ve Zaman Ölçme',
                kazanimlar: [
                  '02.03.01 Uzunluk ölçme birimlerini tanır; metre-kilometre, metre-santimetre-milimetre birimlerini birbirine dönüştürür ve ilgili problemleri çözer.',
                  '02.03.02 Çokgenlerin çevre uzunluklarını hesaplar; verilen bir çevre uzunluğuna sahip farklı şekiller oluşturur.',
                  '02.03.03 Zaman ölçü birimlerini tanır, birbirine dönüştürür ve ilgili problemleri çözer.'
                ]
              },
              {
                konu: '02.04 Geometri ve Ölçme / Alan Ölçme',
                kazanimlar: [
                  '02.04.01 Dikdörtgenin alanını hesaplar; santimetrekare ve metrekareyi kullanır.',
                  '02.04.02 Belirlenen bir alanı santimetrekare ve metrekare birimleriyle tahmin eder.',
                  '02.04.03 Verilen bir alana sahip farklı dikdörtgenler oluşturur.',
                  '02.04.04 Dikdörtgenin alanını hesaplamayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '02.05 Geometri ve Ölçme / Geometrik Cisimler',
                kazanimlar: [
                  '02.05.01 Dikdörtgenler prizmasını tanır ve temel özelliklerini belirler.',
                  '02.05.02 Dikdörtgenler prizmasının yüzey açınımlarını çizer ve verilen farklı açınımların dikdörtgenler prizmasına ait olup olmadığına karar verir.',
                  '02.05.03 Dikdörtgenler prizmasının yüzey alanını hesaplar.'
                ]
              },
              {
                konu: '03.01 Veri İşleme / Araştırma Soruları Üretme, Veri Toplama, Düzenleme ve Gösterme',
                kazanimlar: [
                  '03.01.01 Veri toplamayı gerektiren araştırma soruları oluşturur.',
                  '03.01.02 Araştırma sorularına ilişkin verileri toplar veya ilgili verileri seçer; veriyi uygunluğuna göre sıklık tablosu ve sütun grafiğiyle gösterir.',
                  '03.01.03 Ağaç şeması yaparak verileri düzenler.'
                ]
              },
              {
                konu: '03.02 Veri İşleme / Veri Analizi ve Yorumlama',
                kazanimlar: [
                  '03.02.01 Sıklık tablosu, sütun grafiği veya ağaç şeması ile gösterilmiş veriyi özetler ve yorumlar.'
                ]
              }
            ]
          },
          {
            sinif: '06',
            konular: [
              {
                konu: '01.01 Sayılar ve İşlemler / Doğal Sayılarda İşlemler',
                kazanimlar: [
                  '01.01.01 Bir doğal sayının kendisiyle tekrarlı çarpımını üslü nicelik olarak ifade eder ve üslü niceliklerin değerini belirler.',
                  '01.01.02 İşlem önceliğini dikkate alarak doğal sayılarla dört işlem yapar.',
                  '01.01.03 Doğal sayılarda ortak çarpan parantezine alma ve dağılma özelliğini uygulamaya yönelik işlemler yapar.',
                  '01.01.04 Doğal sayılarla dört işlem yapmayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '01.02 Sayılar ve İşlemler / Çarpanlar ve Katlar',
                kazanimlar: [
                  '01.02.01 Doğal sayıların çarpanlarını ve katlarını belirler.',
                  '01.02.02 2, 3, 4, 5, 6, 9 ve 10’a kalansız bölünebilme kurallarını açıklar ve kullanır.',
                  '01.02.03 Asal sayıları özellikleriyle belirler.',
                  '01.02.04 Doğal sayıların asal çarpanlarını belirler.',
                  '01.02.05 İki doğal sayının ortak bölenlerini belirler.',
                  '01.02.06 İki doğal sayının ortak katlarını belirler.',
                  '01.02.07 İki doğal sayının ortak bölenleri ile ortak katları ile ilgili problemleri çözer.'
                ]
              },
              {
                konu: '01.03 Sayılar ve İşlemler / Tam Sayılar',
                kazanimlar: [
                  '01.03.01 Tam sayıları yorumlar ve sayı doğrusunda gösterir.',
                  '01.03.02 Bir tam sayının mutlak değerini belirler ve anlamlandırır.',
                  '01.03.03 Tam sayıları karşılaştırır ve sıralar.',
                  '01.03.04 Tam sayılarla toplama ve çıkarma işlemlerini yapar; ilgili problemleri çözer.',
                  '01.03.05 Tam sayılarda çıkarma işleminin eksilenin ters işaretlisi ile toplamak anlamına geldiğini kavrar.',
                  '01.03.06 Toplama işleminin özelliklerini akıcı işlem yapmak için birer strateji olarak kullanır.'
                ]
              },
              {
                konu: '01.04 Sayılar ve İşlemler / Kesirlerle İşlemler',
                kazanimlar: [
                  '01.04.01 Kesirleri karşılaştırır, sıralar.',
                  '01.04.02 Kesirleri sayı doğrusunda gösterir.',
                  '01.04.03 Kesirlerle toplama ve çıkarma işlemlerini yapar.',
                  '01.04.04 Bir doğal sayı ile bir kesrin çarpma işlemini yapar ve anlamlandırır.',
                  '01.04.05 İki kesrin çarpma işlemini yapar ve anlamlandırır.',
                  '01.04.06 Bir doğal sayıyı bir birim kesre ve bir birim kesri bir doğal sayıya böler, bu işlemi anlamlandırır.',
                  '01.04.07 Bir doğal sayıyı bir kesre ve bir kesri bir doğal sayıya böler, bu işlemi anlamlandırır.',
                  '01.04.08 İki kesrin bölme işlemini yapar ve anlamlandırır.',
                  '01.04.09 Kesirlerle yapılan işlemlerin sonucunu tahmin eder.',
                  '01.04.10 Kesirlerle işlem yapmayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '01.05 Sayılar ve İşlemler / Ondalık Gösterim',
                kazanimlar: [
                  '01.05.01 Bölme işlemi ile kesir kavramını ilişkilendirir.',
                  '01.05.02 Ondalık gösterimleri verilen sayıları çözümler.',
                  '01.05.03 Ondalık gösterimleri verilen sayıları belirli bir basamağa kadar yuvarlar.',
                  '01.05.04 Ondalık gösterimleri verilen sayılarla çarpma işlemi yapar.',
                  '01.05.05 Ondalık gösterimleri verilen sayılarla bölme işlemi yapar.',
                  '01.05.06 Ondalık gösterimleri verilen sayılarla 10, 100 ve 1000 ile kısa yoldan çarpma ve bölme işlemlerini yapar.',
                  '01.05.07 Sayıların ondalık gösterimleriyle yapılan işlemlerin sonucunu tahmin eder.',
                  '01.05.08 Ondalık ifadelerle dört işlem yapmayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '01.06 Sayılar ve İşlemler / Oran',
                kazanimlar: [
                  '01.06.01 Çoklukları karşılaştırmada oran kullanır ve oranı farklı biçimlerde gösterir.',
                  '01.06.02 Bir bütünün iki parçaya ayrıldığı durumlarda iki parçanın birbirine veya her bir parçanın bütüne oranını belirler; problem durumlarında oranlardan biri verildiğinde diğerini bulur.',
                  '01.06.03 Aynı veya farklı birimlerdeki iki çokluğun birbirine oranını belirler.'
                ]
              },
              {
                konu: '02.01 Cebir / Cebirsel İfadeler',
                kazanimlar: [
                  '02.01.01 Aritmetik dizilerin kuralını harfle ifade eder; kuralı harfle ifade edilen dizinin istenilen terimini bulur.',
                  '02.01.02 Sözel olarak verilen bir duruma uygun cebirsel ifade ve verilen bir cebirsel ifadeye uygun sözel bir durum yazar.',
                  '02.01.03 Cebirsel ifadenin değerlerini değişkenin alacağı farklı doğal sayı değerleri için hesaplar.',
                  '02.01.04 Basit cebirsel ifadelerin anlamını açıklar.',
                  '02.01.05 Cebirsel ifadelerle toplama ve çıkarma işlemleri yapar.',
                  '02.01.06 Bir doğal sayı ile bir cebirsel ifadeyi çarpar.'
                ]
              },
              {
                konu: '03.01 Geometri ve Ölçme / Açılar',
                kazanimlar: [
                  '03.01.01 Açıyı başlangıç noktaları aynı olan iki ışının oluşturduğu şekil olarak tanır ve sembolle gösterir.',
                  '03.01.02 Komşu, tümler, bütünler ve ters açıların özelliklerini keşfeder; ilgili problemleri çözer.',
                  '03.01.03 Bir doğrunun üzerindeki veya dışındaki bir noktadan doğruya dikme çizer.'
                ]
              },
              {
                konu: '03.02 Geometri ve Ölçme / Alan ölçme',
                kazanimlar: [
                  '03.02.01 Paralelkenarda bir kenara ait yüksekliği çizer.',
                  '03.02.02 Paralelkenarın alan bağıntısını oluşturur; ilgili problemleri çözer. (eşkenar dörtgenin alanı paralelkenar özelliğinden hesaplatılır.)',
                  '03.02.03 Üçgende bir kenara ait yüksekliği çizer.',
                  '03.02.04 Üçgenin alan bağıntısını oluşturur; ilgili problemleri çözer.',
                  '03.02.05 Alan ölçme birimlerini tanır, m2–km2, m2–cm2–mm2 birimlerini birbirine dönüştürür.',
                  '03.02.06 Arazi ölçme birimlerini tanır ve standart alan ölçme birimleriyle ilişkilendirir.',
                  '03.02.07 Alan ile ilgili problemleri çözer.'
                ]
              },
              {
                konu: '03.03 Geometri ve Ölçme / Çember',
                kazanimlar: [
                  '03.03.01 Çember çizerek merkezini, yarıçapını ve çapını belirler.',
                  '03.03.02 Çember ile daire arasındaki ilişkiyi açıklar.',
                  '03.03.03 Bir çemberin uzunluğunun çapına oranının sabit bir değer olduğunu ölçme yaparak belirler.',
                  '03.03.04 Çapı veya yarıçapı verilen bir çemberin uzunluğunu hesaplar.'
                ]
              },
              {
                konu: '03.04 Geometri ve Ölçme / Geometrik Cisimler ve Hacim Ölçme',
                kazanimlar: [
                  '03.04.01 Dikdörtgenler prizmasının içine boşluk kalmayacak biçimde yerleştirilen birim küp sayısının o cismin hacmi olduğunu anlar; verilen cismin hacmini birim küpleri sayarak hesaplar.',
                  '03.04.02 Verilen bir hacme sahip farklı dikdörtgenler prizmalarını birim küplerle oluşturur; hacmin taban alanı ile yüksekliğin çarpımı olduğunu gerekçesiyle açıklar.',
                  '03.04.03 Dikdörtgenler prizmasının hacim bağıntısını oluşturur; ilgili problemleri çözer.',
                  '03.04.04 Standart hacim ölçme birimlerini tanır ve santimetreküp-desimetreküp-metre- küp birimleri arasında dönüşüm yapar.',
                  '03.04.05 Dikdörtgenler prizmasının hacmini tahmin eder.'
                ]
              },
              {
                konu: '03.05 Geometri ve Ölçme / Sıvıları Ölçme',
                kazanimlar: [
                  '03.05.01 Sıvı ölçme birimlerini miktar olarak tanır ve birbirine dönüştürür.',
                  '03.05.02 Hacim ölçme birimleri ile sıvı ölçme birimlerini ilişkilendirir.',
                  '03.05.03 Sıvı ölçme birimleriyle ilgili problemler çözer.'
                ]
              },
              {
                konu: '04.01 Veri İşleme / Araştırma Soruları Üretme,Veri Toplama, Düzenleme',
                kazanimlar: [
                  '04.01.01 İki veri grubunu karşılaştırmayı gerektiren araştırma soruları oluşturur.',
                  '04.01.02 Araştırma sorusuna uygun verileri elde eder.',
                  '04.01.03 İki gruba ait verileri ikili sıklık tablosu veya sütun grafiğinden uygun olanla gösterir.'
                ]
              },
              {
                konu: '04.02 Veri İşleme /Veri Analizi',
                kazanimlar: [
                  '04.02.01 Bir veri grubuna ait aritmetik ortalamayı hesaplar ve yorumlar.',
                  '04.02.02 Bir veri grubuna ait açıklığı hesaplar ve yorumlar.',
                  '04.02.03 İki gruba ait verileri karşılaştırmada ve yorumlamada aritmetik ortalama ve açıklığı kullanır.'
                ]
              }
            ]
          },
          {
            sinif: '07',
            konular: [
              {
                konu: '01.01 Sayılar ve İşlemler / Tam Sayılarla Çarpma ve Bölme İşlemleri',
                kazanimlar: [
                  '01.01.01 Tam sayılarla çarpma işlemini yapar.',
                  '01.01.02 Tam sayılarla bölme işlemini yapar.',
                  '01.01.03 Tam sayılarla çok adımlı işlemleri yapar.',
                  '01.01.04 Tam sayılarla işlemler yapmayı gerektiren problemleri çözer.',
                  '01.01.05 Tam sayıların kendileri ile tekrarlı çarpımını üslü nicelik olarak ifade eder.'
                ]
              },
              {
                konu: '01.02 Sayılar ve İşlemler / Rasyonel Sayılar',
                kazanimlar: [
                  '01.02.01 Rasyonel sayıları tanır ve sayı doğrusunda gösterir.',
                  '01.02.02 Rasyonel sayıları ondalık gösterimle ifade eder.',
                  '01.02.03 Devirli olmayan ondalık gösterimleri rasyonel sayı olarak ifade eder.',
                  '01.02.04 Rasyonel sayıları karşılaştırır ve sıralar.',
                  '01.02.05 Rasyonel sayılarla toplama ve çıkarma işlemlerini yapar.'
                ]
              },
              {
                konu: '01.03 Sayılar ve İşlemler / Rasyonel Sayılarla İşlemler',
                kazanimlar: [
                  '01.03.01 Rasyonel sayılarla çarpma işlemini yapar.',
                  '01.03.02 Rasyonel sayılarla bölme işlemini yapar.',
                  '01.03.03 Rasyonel sayıların kare ve küplerini hesaplar.',
                  '01.03.04 Rasyonel sayılarla çok adımlı işlemleri yapar.',
                  '01.03.05 Rasyonel sayılarla işlem yapmayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '01.04 Sayılar ve İşlemler / Oran ve Orantı',
                kazanimlar: [
                  '01.04.01 Birbirine oranı verilen iki çokluktan biri verildiğinde diğerini bulur.',
                  '01.04.02 Oranda çokluklardan birinin 1 olması durumunda diğerinin alacağı değeri belirler.',
                  '01.04.03 Gerçek yaşam durumlarını, tabloları veya doğru grafiklerini inceleyerek iki çokluğun orantılı olup olmadığına karar verir.',
                  '01.04.04 Doğru orantılı iki çokluk arasındaki ilişkiyi tablo veya denklem olarak ifade eder.',
                  '01.04.05 Doğru orantılı iki çokluğa ait orantı sabitini belirler ve yorumlar.',
                  '01.04.06 Gerçek yaşam durumlarını ve tabloları inceleyerek iki çokluğun ters orantılı olup olmadığına karar verir.',
                  '01.04.07 Doğru ve ters orantıyla ilgili problemleri çözer.'
                ]
              },
              {
                konu: '01.05 Sayılar ve İşlemler / Yüzdeler',
                kazanimlar: [
                  '01.05.01 Bir çokluğun belirtilen bir yüzdesine karşılık gelen miktarı bulur; belirli bir yüzdesi verilen çokluğu bulur.',
                  '01.05.02 Bir çokluğu diğer bir çokluğun yüzdesi olarak hesaplar.',
                  '01.05.03 Bir çokluğu belirli bir yüzde ile arttırmaya veya azaltmaya yönelik hesaplamalar yapar.',
                  '01.05.04 Yüzde ile ilgili problemleri çözer.'
                ]
              },
              {
                konu: '02.01 Cebir / Eşitlik ve Denklem',
                kazanimlar: [
                  '02.01.01 Gerçek yaşam durumlarına uygun birinci dereceden bir bilinmeyenli denklemleri kurar.',
                  '02.01.02 Denklemlerde eşitliğin korunumu ilkesini anlar.',
                  '02.01.03 Birinci dereceden bir bilinmeyenli denklemleri çözer.',
                  '02.01.04 Birinci dereceden bir bilinmeyenli denklem kurmayı gerektiren problemleri çözer.'
                ]
              },
              {
                konu: '02.02 Cebir / Doğrusal Denklemler',
                kazanimlar: [
                  '02.02.01 Koordinat sistemini özellikleriyle tanır ve sıralı ikilileri gösterir.',
                  '02.02.02 Aralarında doğrusal ilişki bulunan iki değişkenden birinin diğerine bağlı olarak nasıl değiştiğini tablo, grafik ve denklem ile ifade eder.',
                  '02.02.03 Doğrusal denklemlerin grafiğini çizer.'
                ]
              },
              {
                konu: '03.01 Geometri ve Ölçme / Doğrular ve Açılar',
                kazanimlar: [
                  '03.01.01 Bir açıya eş bir açı çizer.',
                  '03.01.02 Bir açıyı iki eş açıya ayırarak açıortayı belirler.',
                  '03.01.03 İki paralel doğruyla bir keseninin oluşturduğu yöndeş, ters, iç ters, dış ters açıları belirleyerek özelliklerini inceler; oluşan açıların eş veya bütünler olanlarını belirler; ilgili problemleri çözer.'
                ]
              },
              {
                konu: '03.02 Geometri ve Ölçme / Çokgenler',
                kazanimlar: [
                  '03.02.01 Düzgün çokgenlerin kenar ve açı özelliklerini açıklar.',
                  '03.02.02 Çokgenlerin köşegenlerini, iç ve dış açılarını belirler; iç açılarının ve dış açılarının ölçüleri toplamını hesaplar.',
                  '03.02.03 Dikdörtgen, paralelkenar, yamuk ve eşkenar dörtgeni tanır; açı özelliklerini belirler.',
                  '03.02.04 Eşkenar dörtgen ve yamuğun alan bağıntılarını oluşturur; ilgili problemleri çözer.',
                  '03.02.05 Alan ile ilgili problemleri çözer.'
                ]
              },
              {
                konu: '03.03 Geometri ve Ölçme / Çember ve Daire',
                kazanimlar: [
                  '03.03.01 Çemberde merkez açıları, gördüğü yayları ve ölçüleri arasındaki ilişkileri belirler.',
                  '03.03.02 Çemberin ve çember parçasının uzunluğunu hesaplar.',
                  '03.03.03 Dairenin ve daire diliminin alanını hesaplar.'
                ]
              },
              {
                konu: '03.04 Geometri ve Ölçme / Dönüşüm Geometrisi',
                kazanimlar: [
                  '03.04.01 Düzlemsel şekilleri karşılaştırarak eş olup olmadıklarını belirler ve bir şekle eş şekiller oluşturur.',
                  '03.04.02 Düzlemde nokta, doğru parçası ve diğer şekillerin öteleme altındaki görüntülerini çizer.',
                  '03.04.03 Ötelemede şekil üzerindeki her bir noktanın aynı yön ve büyüklükte bir dönüşüme tabi olduğunu ve şekil ile görüntüsünün eş olduğunu keşfeder.',
                  '03.04.04 Düzlemde nokta, doğru parçası ve diğer şekillerin yansıma sonucu oluşan görüntüsünü oluşturur.',
                  '03.04.05 Yansımada şekil ile görüntüsü üzerinde birbirlerine karşılık gelen noktaların simetri doğrusuna olan uzaklıklarının eşit ve şekil ile görüntüsünün eş olduğunu keşfeder.',
                  '03.04.06 Düzlemsel bir şeklin ardışık ötelemeler ve yansımalar sonucunda ortaya çıkan görüntüsünü oluşturur.'
                ]
              },
              {
                konu: '03.05 Geometri ve Ölçme / Cisimlerin Farklı Yönlerden Görünümleri',
                kazanimlar: [
                  '03.05.01 Üç boyutlu cisimlerin farklı yönlerden iki boyutlu görünümlerini çizer.',
                  '03.05.02 Farklı yönlerden görünümlerine ilişkin çizimleri verilen yapıları oluşturur.'
                ]
              },
              {
                konu: '04.01 Veri İşleme / Araştırma Soruları Üretme, Veri Toplama, Düzenleme, Değerlendirme ve Yorumlama',
                kazanimlar: [
                  '04.01.01 Bir veri grubuna ilişkin daire grafiğini oluşturur ve yorumlar.',
                  '04.01.02 Verilere ilişkin çizgi grafiği oluşturur ve yorumlar.',
                  '04.01.03 Bir veri grubuna ait ortalama, ortanca ve tepe değeri elde eder ve yorumlar.',
                  '04.01.04 Araştırma sorularına ilişkin verileri uygunluğuna göre daire grafiği, sıklık tablosu, sütun grafiği veya çizgi grafiğiyle gösterir ve bu gösterimler arasında dönüşümler yapar.'
                ]
              }
            ]
          },
          {
            sinif: '08',
            konular: [
              {
                konu: '01.01 Cebir / Örüntüler ve İlişkiler',
                kazanimlar: [
                  '01.01.01 Özel sayı örüntülerinde sayılar arasındaki ilişkileri açıklar.'
                ]
              },
              {
                konu: '01.02 Cebir / Cebirsel İfadeler',
                kazanimlar: [
                  '01.02.01 Özdeşlik ile denklem arasındaki farkı açıklar.',
                  '01.02.02 Özdeşlikleri modellerle açıklar.',
                  '01.02.03 Cebirsel ifadeleri çarpanlarına ayırır.',
                  '01.02.04 Rasyonel cebirsel ifadelerle işlem yapar ve ifadeleri sadeleştirir.'
                ]
              },
              {
                konu: '01.03 Cebir / Denklemler',
                kazanimlar: [
                  '01.03.01 Doğrunun eğimini modelleri ile açıklar.',
                  '01.03.02 Doğrunun eğimi ile denklemi arasındaki ilişkiyi belirler.',
                  '01.03.03 Bir bilinmeyenli rasyonel denklemleri çözer.',
                  '01.03.04 Doğrusal denklem sistemlerini cebirsel yöntemlerle çözer.',
                  '01.03.05 Doğrusal denklem sistemlerini grafikleri kullanarak çözer.'
                ]
              },
              {
                konu: '01.04 Cebir / Eşitsizlikler',
                kazanimlar: [
                  '01.04.01 Eşitlik ve eşitsizlik arasındaki ilişkiyi açıklar ve eşitsizlik içeren problemlere uygun matematik cümleleri yazar.',
                  '01.04.02 Birinci dereceden bir bilinmeyenli eşitsizliklerin çözüm kümesini belirler ve sayı doğrusunda gösterir.',
                  '01.04.03 İki bilinmeyenli doğrusal eşitsizliklerin grafiğini çizer.'
                ]
              },
              {
                konu: '02.01 Geometri / Üçgenler',
                kazanimlar: [
                  '02.01.01 Atatürk’ün matematik alanında yaptığı çalışmaların önemini açıklar',
                  '02.01.02 Üçgenin iki kenar uzunluğunun toplamı veya farkı ile üçüncü kenarının uzunluğu arasındaki ilişkiyi belirler.',
                  '02.01.03 Üçgenin kenar uzunlukları ile bu kenarların karşısındaki açıların ölçüleri arasındaki ilişkiyi belirler.',
                  '02.01.04 Yeterli sayıda elemanının ölçüleri verilen bir üçgeni çizer.',
                  '02.01.05 Üçgende kenarortay, kenar orta dikme, açıortay ve yüksekliği inşa eder',
                  '02.01.06 Üçgenlerde eşlik şartlarını açıklar.',
                  '02.01.07 Üçgenlerde benzerlik şartlarını açıklar.',
                  '02.01.08 Pythagoras (Pisagor) bağıntısını oluşturur.',
                  '02.01.09 Dik üçgendeki dar açıların trigonometrik oranlarını belirler.'
                ]
              },
              {
                konu: '02.02 Geometri / Geometrik Cisimler',
                kazanimlar: [
                  '02.02.01 Prizmayı inşa eder, temel elemanlarını belirler ve yüzey açınımını çizer.',
                  '02.02.02 Piramidi inşa eder, temel elemanlarını belirler ve yüzey açınımını çizer.',
                  '02.02.03 Koninin temel elemanlarını belirler, inşa eder ve yüzey açınımını çizer.',
                  '02.02.04 Kürenin temel elemanlarını belirler ve inşa eder.',
                  '02.02.05 Bir düzlem ile bir geometrik cismin ara kesitini belirler ve inşa eder.',
                  '02.02.06 Çok yüzlüleri sınıflandırır',
                  '02.02.07 Çizimleri verilen yapıları çok küplülerle oluşturur, çok küplülerle oluşturulan yapıların görünümlerini çizer.'
                ]
              },
              {
                konu: '02.03 Geometri / Örüntü ve Süslemeler',
                kazanimlar: [
                  '02.03.01 Doğru, çokgen ve çember modellerinden örüntüler inşa eder, çizer ve bu örüntülerden fraktal olanları belirler.'
                ]
              },
              {
                konu: '02.04 Geometri / Dönüşüm Geometrisi',
                kazanimlar: [
                  '02.04.01 Koordinat düzleminde bir çokgenin eksenlerden birine göre yansıma, herhangi bir doğru boyunca öteleme ve orijin etrafındaki dönme altında görüntülerini belirleyerek çizer.',
                  '02.04.02 Geometrik cisimlerin simetrilerini belirler.',
                  '02.04.03 Şekillerin ötelemeli yansımasını belirler ve inşa eder.'
                ]
              },
              {
                konu: '02.05 Geometri / İz Düşümü',
                kazanimlar: [
                  '02.05.01 Bir küpün, bir prizmanın belli bir mesafeden görünümünün perspektif çizimini yapar.'
                ]
              },
              {
                konu: '03.01 Olasılık ve İstatistik / Olası Durumları Belirleme',
                kazanimlar: [
                  '03.01.01 Kombinasyon kavramını açıklar ve hesaplar.',
                  '03.01.02 Permütasyon ve kombinasyon arasındaki farkı açıklar.'
                ]
              },
              {
                konu: '03.02 Olasılık ve İstatistik / Olay Çeşitleri',
                kazanimlar: [
                  '03.02.01 Bağımlı ve bağımsız olayları açıklar.',
                  '03.02.02 Bağımlı ve bağımsız olayların olma olasılıklarını hesaplar.'
                ]
              },
              {
                konu: '03.03 Olasılık ve İstatistik / Olasılık Çeşitleri',
                kazanimlar: [
                  '03.03.01 Deneysel, teorik ve öznel olasılığı açıklar.'
                ]
              },
              {
                konu: '03.04 Olasılık ve İstatistik / Araştırmalar İçin Soru Oluşturma ve Veri Toplama',
                kazanimlar: [
                  '03.04.01 İki topluluğu karşılaştıran sorular üretir ve veri toplar.',
                  '03.04.02 Verilen örnekleme uygun araştırma sorusu belirler.'
                ]
              },
              {
                konu: '03.05 Olasılık ve İstatistik / Tablo ve Grafikler',
                kazanimlar: [
                  '03.05.01 Histogram oluşturur ve yorumlar.'
                ]
              },
              {
                konu: '03.06 Olasılık ve İstatistik / Merkezî Eğilim ve Yayılma Ölçüleri',
                kazanimlar: [
                  '03.06.01 Standart sapmayı hesaplar.',
                  '03.06.02 İstatistiksel temsil biçimlerini, merkezî eğilim ölçülerini ve standart sapmayı kullanarak gerçek yaşam durumları için görüş oluşturur.'
                ]
              },
              {
                konu: '04.01 Ölçme / Üçgenlerde Ölçme',
                kazanimlar: [
                  '04.01.01 Üçgenlerde benzerlik şartlarını problemlerde uygular.',
                  '04.01.02 Pythagoras (Pisagor) bağıntısını problemlerde uygular.',
                  '04.01.03 Dik üçgendeki dar açıların trigonometrik oranlarını problemlerde uygular.'
                ]
              },
              {
                konu: '04.02 Ölçme / Geometrik Cisimlerin Hacimleri',
                kazanimlar: [
                  '04.02.01 Dik prizmaların hacim bağıntılarını oluşturur.',
                  '04.02.02 Dik piramidin hacim bağıntısını oluşturur',
                  '04.02.03 Dik dairesel koninin hacim bağıntısını oluşturur.',
                  '04.02.04 Kürenin hacim bağıntısını oluşturur',
                  '04.02.05 Geometrik cisimlerin hacimleri ile ilgili problemleri çözer ve kurar.',
                  '04.02.06 Geometrik cisimlerin hacimlerini strateji kullanarak tahmin eder.'
                ]
              },
              {
                konu: '04.03 Ölçme / Geometrik Cisimlerin Yüzey Alanları',
                kazanimlar: [
                  '04.03.01 Dik prizmaların yüzey alanının bağıntılarını oluşturur.',
                  '04.03.02 Dik piramidin yüzey alanının bağıntısını oluşturur.',
                  '04.03.03 Dik dairesel koninin yüzey alanının bağıntısını oluşturur.',
                  '04.03.04 Kürenin yüzey alanının bağıntısını oluşturur.',
                  '04.03.05 Geometrik cisimlerin yüzey alanları ile ilgili problemleri çözer ve kurar.',
                  '04.03.06 Geometrik cisimlerin yüzey alanlarını strateji kullanarak tahmin eder.'
                ]
              },
              {
                konu: '05.01 Sayılar / Üslü Sayılar',
                kazanimlar: [
                  '05.01.01 Bir tam sayının negatif kuvvetini belirler ve rasyonel sayı olarak ifade eder.',
                  '05.01.02 Ondalık kesirlerin veya rasyonel sayıların kendileriyle tekrarlı çarpımını üslü sayı olarak yazar ve değerini belirler.',
                  '05.01.03 Üslü sayılarla çarpma ve bölme işlemlerini yapar.',
                  '05.01.04 Çok büyük ve çok küçük pozitif sayıları bilimsel gösterimle ifade eder.'
                ]
              },
              {
                konu: '05.02 Sayılar / Kareköklü Sayılar',
                kazanimlar: [
                  '05.02.01 Tam kare doğal sayılarla bu sayıların karekökleri arasındaki ilişkiyi modelleriyle açıklar ve kareköklerini belirler.',
                  '05.02.02 Tam kare olmayan sayıların kareköklerini strateji kullanarak tahmin eder.',
                  '05.02.03 Kareköklü bir sayıyı şeklinde yazar ve şeklindeki ifadede katsayıyı kök içine alır.',
                  '05.02.04 Kareköklü sayılarla toplama ve çıkarma işlemlerini yapar.',
                  '05.02.05 Kareköklü sayılarla çarpma ve bölme işlemlerini yapar.',
                  '05.02.06 Ondalık kesirlerin kareköklerini belirler.'
                ]
              },
              {
                konu: '05.03 Sayılar / Gerçek Sayılar',
                kazanimlar: [
                  '05.03.01 Rasyonel sayılar ile irrasyonel sayılar arasındaki farkı açıklar.',
                  '05.03.02 Gerçek sayılar kümesini oluşturan sayı kümelerini belirtir.'
                ]
              }
            ]
          }
        ]
      },
      {
        ders: 'Fen ve Teknoloji',
        isim: 'Ateş',
        slug: 'ates',
        muhurler: [
          {isim: 'Kızgan', slugYeni: 'kizgan', seviye: 'gumus', slug: 'akrep'},
          {isim: 'Mengüç', slugYeni: 'menguc', seviye: 'gumus', slug: 'anka'},
          {isim: 'Çagavun', slugYeni: 'cagavun', seviye: 'gumus', slug: 'ari'},
          {isim: 'Bayur', slugYeni: 'bayur', seviye: 'gumus', slug: 'cingirakli-yilan'},
          {isim: 'Gur', slugYeni: 'gur', seviye: 'gumus', slug: 'ejder'},
          {isim: 'Alaban', slugYeni: 'alaban', seviye: 'gumus', slug: 'kertenkele'},
          {isim: 'İgan', slugYeni: 'igan', seviye: 'gumus', slug: 'kobra'},
          {isim: 'Şumga', slugYeni: 'sumga', seviye: 'gumus', slug: 'kurbaga'},
          {isim: 'Tumay', slugYeni: 'tumay', seviye: 'gumus', slug: 'orumcek'},
          {isim: 'Bükü', slugYeni: 'buku', seviye: 'gumus', slug: 'yarasa'},
          {isim: 'Aldur', slugYeni: 'aldur', seviye: 'altin', slug: 'akrep'},
          {isim: 'İrkin', slugYeni: 'irkin', seviye: 'altin', slug: 'anka'},
          {isim: 'Bagay', slugYeni: 'bagay', seviye: 'altin', slug: 'ari'},
          {isim: 'Kakşa', slugYeni: 'kaksa', seviye: 'altin', slug: 'cingirakli-yilan'},
          {isim: 'Bögü', slugYeni: 'bogu', seviye: 'altin', slug: 'ejder'},
          {isim: 'Mendeş', slugYeni: 'mendes', seviye: 'altin', slug: 'kertenkele'},
          {isim: 'Çoga', slugYeni: 'coga', seviye: 'altin', slug: 'kobra'},
          {isim: 'Kabar', slugYeni: 'kabar', seviye: 'altin', slug: 'kurbaga'},
          {isim: 'Eymen', slugYeni: 'eymen', seviye: 'altin', slug: 'orumcek'},
          {isim: 'Sılkım', slugYeni: 'silkim', seviye: 'altin', slug: 'yarasa'}
        ],
        mufredat: [
          {
            sinif: '05',
            konular: [
              {
                konu: '01.01 Canlılar ve Hayat / Besinler ve Özellikleri',
                kazanimlar: [
                  '01.01.01 Besin içeriklerinin, canlıların yaşamsal faaliyetleri için gerekli olduğunu fark eder.',
                  '01.01.02 Vitamin çeşitlerinin en fazla hangi besinlerde bulunduğunu araştırır ve sunar.',
                  '01.01.03 Su ve minerallerin bütün besinlerde bulunduğu çıkarımını yapar.',
                  '01.01.04 Dengeli beslenmenin insan sağlığına etkilerini araştırır ve sunar.',
                  '01.01.05 Sağlıklı bir yaşam için besinlerin tazeliğinin ve doğallığının önemini, araştırma verilerine dayalı olarak tartışır.',
                  '01.01.06 Sigara ve alkol kullanımının vücuda verdiği zararları araştırma verilerine dayalı olarak tartışır.'
                ]
              },
              {
                konu: '01.02 Canlılar ve Hayat / Besinlerin Sindirimi',
                kazanimlar: [
                  '01.02.01 Sindirimde görevli yapı ve organların yerini model üzerinde sırasıyla gösterir.',
                  '01.02.02 Diş çeşitlerini model üzerinde göstererek görevlerini açıklar.',
                  '01.02.03 Diş sağlığı için beslenmeye, temizliğe ve düzenli diş kontrolüne özen gösterir.',
                  '01.02.04 Besinlerin sindirildikten sonra vücutta kan yoluyla taşındığı çıkarımını yapar.'
                ]
              },
              {
                konu: '01.03 Canlılar ve Hayat /  Vücudumuzda Boşaltım',
                kazanimlar: [
                  '01.03.01 Boşaltımda görevli yapı ve organları tanır.',
                  '01.03.02 Vücutta farklı boşaltım şekillerinin olduğu ve boşaltım faaliyetleri sonucu oluşan zararlı maddelerin vücut dışına atılması gerektiği çıkarımını yapar.',
                  '01.03.03 Böbreklerin sağlığını korumak için nelere dikkat edilmesi gerektiğini araştırır ve sunar.'
                ]
              },
              {
                konu: '01.04 Canlılar ve Hayat /  Canlıları Tanıyalım',
                kazanimlar: [
                  '01.04.01 Canlılara örnekler vererek benzerlik ve farklılıklarına göre gruplandırır.'
                ]
              },
              {
                konu: '01.05 Canlılar ve Hayat / İnsan ve Çevre İlişkisi',
                kazanimlar: [
                  '01.05.01 İnsan faaliyetleri sonucunda oluşan çevre sorunlarını araştırır ve bu sorunların çözümüne ilişkin önerilerde bulunur.',
                  '01.05.02 Yakın çevresindeki bir çevre sorununun çözümüne ilişkin proje tasarlar ve sunar.'
                ]
              },
              {
                konu: '02.01 Madde ve Değişim / Maddenin Hâl Değişimi',
                kazanimlar: [
                  '02.01.01 Maddelerin ısı etkisiyle hâl değiştirebileceğine yönelik deneyler yapar, elde ettiği verilere dayalı çıkarımlarda bulunur.'
                ]
              },
              {
                konu: '02.02 Madde ve Değişim / Maddenin Ayırt Edici Özellikleri',
                kazanimlar: [
                  '02.02.01 Saf maddelerin ayırt edici özelliklerinden erime, donma ve kaynama noktalarını, yaptığı deneyler sonucunda belirler.'
                ]
              },
              {
                konu: '02.03 Madde ve Değişim / Isı ve Sıcaklık',
                kazanimlar: [
                  '02.03.01 Isı ve sıcaklık arasındaki temel farkları açıklar.',
                  '02.03.02 Sıcaklığı farklı olan sıvıların karıştırılması sonucu ısı alışverişi olduğuna yönelik deneyler yapar ve sonuçlarını yorumlar.'
                ]
              },
              {
                konu: '02.04 Madde ve Değişim / Isı Maddeleri Etkiler',
                kazanimlar: [
                  '02.04.01 Isı etkisiyle maddelerin genleşip büzüleceğine yönelik deneyler yapar ve sonuçlarını tartışır.',
                  '02.04.02 Günlük yaşamdan örneklerle genleşme ve büzülme olayları arasındaki ilişkiyi fark eder.'
                ]
              },
              {
                konu: '03.01 Dünya ve Evren / Yer Kabuğunda Neler Var?',
                kazanimlar: [
                  '03.01.01 Yer kabuğunun kara tabakasının kayaçlardan oluştuğunu bilir.',
                  '03.01.02 Kayaçlarla madenleri ilişkilendirir ve madenlerin teknolojik ham madde olarak önemini tartışır.',
                  '03.01.03 Fosillerin oluşumunu ve fosil çeşitlerini araştırır ve sunar.',
                  '03.01.04 Fosil bilimin, bir bilim dalı olduğunu kavrar ve bu alanda çalışan uzmanlara ne ad verildiğini bilir.',
                  '03.01.05 Doğal anıtlara örnekler verir ve kültürel miras olarak önemini tartışır.',
                  '03.01.06 Doğal anıtların korunarak gelecek nesillere aktarılmasına yönelik öneriler sunar.'
                ]
              },
              {
                konu: '03.02 Dünya ve Evren / Erozyon ve Heyelanın Yer Kabuğuna Etkisi',
                kazanimlar: [
                  '03.02.01 Erozyon ile heyelan arasındaki farkı açıklar ve erozyonun gelecekte yol açabileceği sonuçları tahmin eder.',
                  '03.02.02 Toprağı erozyonun olumsuz etkilerinden korumak için çözüm önerileri sunar.'
                ]
              },
              {
                konu: '03.03 Dünya ve Evren / Yer Kabuğundaki Yer Altı ve Yer Üstü Suları',
                kazanimlar: [
                  '03.03.01 Yer altı ve yer üstü sularına örnekler verir ve kullanım alanlarını açıklar.'
                ]
              },
              {
                konu: '03.04 Dünya ve Evren / Hava, Toprak ve Su Kirliliği',
                kazanimlar: [
                  '03.04.01 Hava, toprak ve su kirliliğinin nedenlerini, yol açacağı olumsuz sonuçları ve alınabilecek önlemleri tartışır.'
                ]
              },
              {
                konu: '04.01 Fiziksel Olaylar / Sürtünme Kuvveti',
                kazanimlar: [
                  '04.01.01 Sürtünme kuvvetinin çeşitli ortamlarda hareketi engelleyici etkisini deneyerek keşfeder ve sürtünme kuvvetine günlük yaşamdan örnekler verir.'
                ]
              },
              {
                konu: '04.02 Fiziksel Olaylar / Işığın Yayılması',
                kazanimlar: [
                  '04.02.01 Bir kaynaktan çıkan ışığın her yönde ve doğrusal bir yol izlediğini bilir ve çizimle gösterir.'
                ]
              },
              {
                konu: '04.03 Fiziksel Olaylar / Işığın Maddeyle Karşılaşması',
                kazanimlar: [
                  '04.03.01 Maddeleri, ışığı geçirme durumlarına göre sınıflandırır ve örnekler verir.'
                ]
              },
              {
                konu: '04.04 Fiziksel Olaylar / Tam Gölge',
                kazanimlar: [
                  '04.04.01 Tam gölgenin nasıl oluştuğunu gözlemler ve basit ışın çizimleri ile gösterir.',
                  '04.04.02 Tam gölgenin durumunu etkileyen değişkenlerin neler olduğunu tahmin eder ve tahminlerini test eder.'
                ]
              },
              {
                konu: '04.05 Fiziksel Olaylar / Sesin Yayılması',
                kazanimlar: [
                  '04.05.01 Sesin yayılabildiği ortamları tahmin eder ve bu tahminlerini test eder.'
                ]
              },
              {
                konu: '04.06 Fiziksel Olaylar / Sesin Farklı Ortamlarda Farklı Duyulması',
                kazanimlar: [
                  '04.06.01 Farklı cisimlerle üretilen seslerin farklı olduğunu deneyerek keşfeder.',
                  '04.06.02 Aynı sesin, farklı ortamlarda farklı duyulduğunu keşfeder.'
                ]
              },
              {
                konu: '04.07 Fiziksel Olaylar / Basit Bir Elektrik Devresinde Lamba Parlaklığını Etkileyen Değişkenler',
                kazanimlar: [
                  '04.07.01 Bir elektrik devresindeki lamba parlaklığını etkileyen değişkenlerin neler olduğunu tahmin eder ve tahminlerini test eder.'
                ]
              },
              {
                konu: '04.08 Fiziksel Olaylar / Devre Elemanlarının Sembollerle Gösterimi ve Devre Şemaları',
                kazanimlar: [
                  '04.08.01 Bir elektrik devresindeki elemanları sembolleriyle gösterir.',
                  '04.08.02 Bir elektrik devresi şeması çizer, çizdiği devreyi kurar ve çalıştırır.'
                ]
              },
              {
                konu: '05.01 Kuvvetin Büyüklüğünün Ölçülmesi / Kuvvetin Ölçülmesi',
                kazanimlar: [
                  '05.01.01 Kuvvetin büyüklüğünü dinamometre ile ölçer ve birimini ifade eder.',
                  '05.01.02 Kuvvetin büyüklüğünü dinamometre ile ölçer ve birimini ifade eder.'
                ]
              }
            ]
          },
          {
            sinif: '06',
            konular: [
              {
                konu: '01.01 Vücudumuzdaki Sistemler - Canlılar ve Hayat / Hücre',
                kazanimlar: [
                  '01.01.01 Hayvan ve bitki hücrelerini, temel kısımları ve görevleri açısından karşılaştırır',
                  '01.01.02 Geçmişten günümüze, hücrenin yapısı ile ilgili olarak ileri sürülen görüşleri teknolojik gelişmelerle ilişkilendirerek tartışır.',
                  '01.01.03 Hücre-doku-organ-sistem-organizma ilişkisini açıklar.'
                ]
              },
              {
                konu: '01.02 Vücudumuzdaki Sistemler - Canlılar ve Hayat / Destek ve Hareket Sistemi',
                kazanimlar: [
                  '01.02.01 Destek ve hareket sistemine ait yapıları açıklar ve görevlerini belirterek örnekler verir.',
                  '01.02.02 Destek ve hareket sisteminin sağlığını korumak için yapılması gerekenleri araştırır ve sunar.'
                ]
              },
              {
                konu: '01.03 Vücudumuzdaki Sistemler - Canlılar ve Hayat / Solunum Sistemi',
                kazanimlar: [
                  '01.03.01 Solunum sistemini oluşturan yapı ve organları model üzerinde gösterir.',
                  '01.03.02 Akciğerlerin yapısını açıklar ve alveol-kılcal damar arasındaki gaz alışverişini model üzerinde gösterir.',
                  '01.03.03 Solunum sisteminin sağlığını korumak için yapılması gerekenleri araştırma verilerine dayalı olarak tartışır.'
                ]
              },
              {
                konu: '01.04 Vücudumuzdaki Sistemler - Canlılar ve Hayat / Dolaşım Sistemi',
                kazanimlar: [
                  '01.04.01 Dolaşım sistemini oluşturan yapı ve organları görevleri ile birlikte açıklar.',
                  '01.04.02 Büyük ve küçük kan dolaşımını şema üzerinde gösterir.',
                  '01.04.03 Kanın yapı ve görevlerini kavrar.',
                  '01.04.04 Kan grupları arasındaki kan alışverişini kavrar.',
                  '01.04.05 Kan bağışının toplum açısından önemini araştırarak fark eder.',
                  '01.04.06 Dolaşım sisteminin sağlığını korumak için yapılması gerekenleri araştırma verilerine dayalı olarak tartışır.'
                ]
              },
              {
                konu: '02.01 Kuvvet ve Hareket - Fiziksel Olaylar / Bileşke Kuvvet',
                kazanimlar: [
                  '02.01.01 Bir cisme etki eden kuvvetin yönünü, doğrultusunu ve büyüklüğünü çizerek gösterir.',
                  '02.01.02 Bileşke kuvveti açıklar.',
                  '02.01.03 Bir cisme etki eden birden fazla kuvveti deneyle ve çizimle gösterir.',
                  '02.01.04 Dengelenmiş ve dengelenmemiş kuvvetleri, cisimlerin hareket durumlarını gözlemleyerek keşfeder ve karşılaştırır.'
                ]
              },
              {
                konu: '02.02 Kuvvet ve Hareket - Fiziksel Olaylar / Sabit Süratli Hareket',
                kazanimlar: [
                  '02.02.01 Sürati tanımlar ve birimini ifade eder.',
                  '02.02.02 Yol, zaman ve sürat arasındaki ilişkiyi grafik üzerinde gösterir ve yorumlar.'
                ]
              },
              {
                konu: '03.01 Maddenin Tanecikli Yapısı - Madde ve Değişim / Maddenin Tanecikli Yapısı',
                kazanimlar: [
                  '03.01.01 Maddelerin; tanecikli, boşluklu ve hareketli yapıda olduğunu kavrar.',
                  '03.01.02 Hâl değişimine bağlı olarak maddenin tanecikleri arasındaki boşluk ve hareketliliğin değiştiğini kavrar.'
                ]
              },
              {
                konu: '03.02 Maddenin Tanecikli Yapısı - Madde ve Değişim / Fiziksel ve Kimyasal Değişmeler',
                kazanimlar: [
                  '03.02.01 Fiziksel ve kimyasal değişim arasındaki farkları, çeşitli olayları gözlemleyerek açıklar.'
                ]
              },
              {
                konu: '03.03 Maddenin Tanecikli Yapısı - Madde ve Değişim / Yoğunluk',
                kazanimlar: [
                  '03.03.01 Yoğunluğu tanımlar ve birimini belirtir.',
                  '03.03.02 Tasarladığı deneyler sonucunda çeşitli maddelerin yoğunluklarını hesaplar.',
                  '03.03.03 Birbiri içinde çözünmeyen sıvıların yoğunluklarını deney yaparak karşılaştırır.',
                  '03.03.04 Suyun katı ve sıvı hâllerine ait yoğunlukları karşılaştırarak bu durumun canlılar içinönemini sorgular.'
                ]
              },
              {
                konu: '04.01 Işık ve Ses - Fiziksel Olaylar / Işığın Yansıması',
                kazanimlar: [
                  '04.01.01 Işığın düzgün ve pürüzlü yüzeylerdeki yansımalarını gözlemler ve ışınlar çizerek gösterir.',
                  '04.01.02 Işığın yansımasında gelen ışın, yansıyan ışın ve yüzeyin normali arasındaki ilişkiyi açıklar.'
                ]
              },
              {
                konu: '04.02 Işık ve Ses - Fiziksel Olaylar / Sesin Maddeyle Etkileşmesi',
                kazanimlar: [
                  '04.02.01 Sesin madde ile etkileşimi sonucunda oluşabilecek durumları kavrar.',
                  '04.02.02 Sesin yayılmasını önlemeye yönelik tahminlerde bulunur ve tahminlerini test eder.',
                  '04.02.03 Ses yalıtımının önemini açıklar ve ses yalıtımı için geliştirilen teknolojik ve mimari uygulamalara örnekler verir.',
                  '04.02.04 Bitki ve hayvanlardaki üreme çeşitlerini karşılaştırır.',
                  '04.02.05 Bitki ve hayvanlardaki büyüme ve gelişme süreçlerini örnekler vererek açıklar.',
                  '04.02.06 Bitki ve hayvanlarda büyüme ve gelişmeye etki eden faktörleri açıklar.',
                  '04.02.07 Bir bitki ya da hayvanın bakımını üstlenir ve gelişim sürecini rapor eder.'
                ]
              },
              {
                konu: '05.01 Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme / Canlılar ve Hayat',
                kazanimlar: [
                  '05.01.01 ...'
                ]
              },
              {
                konu: '06.01 Madde ve Isı - Madde ve Değişim / Madde ve Isı',
                kazanimlar: [
                  '06.01.01 Maddeleri, ısı iletimi bakımından sınıflandırır.',
                  '06.01.02 Binalarda ısı yalıtımının önemini, aile ve ülke ekonomisi ve kaynakların etkili kullanımı bakımından tartışır.',
                  '06.01.03 Binalarda kullanılan ısı yalıtım malzemelerinin seçilme ölçütlerini belirler.',
                  '06.01.04 Alternatif ısı yalıtım malzemeleri geliştirir.'
                ]
              },
              {
                konu: '06.02 Madde ve Isı - Madde ve Değişim / Yakıtlar',
                kazanimlar: [
                  '06.02.01 Yakıtları, katı, sıvı ve gaz yakıtlar olarak sınıflandırarak yaygın olarak kullanılan yakıtlara örnekler verir.',
                  '06.02.02 Farklı türdeki yakıtların ısı amaçlı kullanımının, insan ve çevre üzerine etkilerini araştırır ve sunar.',
                  '06.02.03 Soba ve doğal gaz zehirlenmeleri ile ilgili alınması gereken tedbirleri araştırır ve rapor eder.',
                  '06.02.04 Tasarladığı elektrik devresini kullanarak maddeleri, elektriği iletme durumlarına göre sınıflandırır.',
                  '06.02.05 Maddelerin elektriksel iletkenlik ve yalıtkanlık özelliklerinin hangi amaçlar için kullanıldığını günlük yaşamdan örneklerle açıklar.'
                ]
              },
              {
                konu: '07.01 Elektriğin İletimi - Fiziksel Olaylar / Elektriksel Direnç ve Bağlı Olduğu Faktörler',
                kazanimlar: [
                  '07.01.01 Bir elektrik devresindeki ampulün parlaklığının bağlı olduğu değişkenleri tahmin eder ve tahminlerini deneyerek test eder.',
                  '07.01.02 Elektriksel direnci ifade ederek bir iletkenin direncini ölçer ve birimini belirtir.',
                  '07.01.03 Ampulün de bir iletken telden oluştuğunu ve bir direncinin olduğunu fark eder.',
                  '07.01.04 Dünya, Güneş ve Ay’ın şekil ve büyüklüklerini, oluşturduğu modeli kullanarak karşılaştırır.'
                ]
              },
              {
                konu: '08.01 Dünyamız, Ay ve Yaşam Kaynağımız Güneş - Dünya ve Evren / Dünyamızın Katman Modeli',
                kazanimlar: [
                  '08.01.01 Dünya’nın yapısını temsil eden katman modelini açıklar ve bu katmanları genel özelliklerine göre karşılaştırır.'
                ]
              },
              {
                konu: '08.02 Dünyamız, Ay ve Yaşam Kaynağımız Güneş - Dünya ve Evren / Dünyamızın Uydusu Ay',
                kazanimlar: [
                  '08.02.01 Ay’ın kendi etrafında dönerken aynı zamanda da Dünya etrafında dolandığını ifade ederek; bu hareketleri temsil bir model oluşturur ve sunar.',
                  '08.02.02 Güneş’ten aldığı ışığı yansıtan Ay’ın, evrelerini ifade eder ve evrelerin görülme sebebini Ay’ın Dünya etrafındaki dolanma hareketi ile ilişkilendirir.'
                ]
              },
              {
                konu: '09.01 Bilimsel Süreç Basamakları',
                kazanimlar: [
                  '09.01.01 ...'
                ]
              }
            ]
          },
          {
            sinif: '07',
            konular: [
              {
                konu: '01.01 Güneş Sistemi ve Ötesi: Uzay Bilmecesi / Uzayda bulunan gök cisimleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '01.01.01 Gök cisimlerini çıplak gözle gözleyerek özelliklerini belirler.',
                  '01.01.02 Uzayda, çıplak gözle gözleyebildiğimizden çok daha fazla gök cismi olduğunu fark eder.',
                  '01.01.03 Bilinen takım yıldızlara örnekler verir.',
                  '01.01.04 Kuyruklu yıldızlara örnekler verir.',
                  '01.01.05 Gözlem yaparken, yıldızlarla gezegenleri birbirinden ayırt eder.',
                  '01.01.06 Güneş’in de bir yıldız olduğunu ifade eder.',
                  '01.01.07 Yıldızlar arasındaki çok uzak mesafelerin "ışık yılı" adı verilen bir uzaklık ölçüsü birimiyle ifade edildiğini belirtir.',
                  '01.01.08 Meteor ile gök taşı arasındaki farkı açıklar.'
                ]
              },
              {
                konu: '01.02 Güneş Sistemi ve Ötesi: Uzay Bilmecesi / Güneş sistemi ve uzay ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '01.02.01 Güneş sistemindeki gezegenleri Güneş’e yakınlıklarına göre sıralar',
                  '01.02.02 Güneş sistemindeki gezegenlerin Güneş’e olan uzaklıklarının "astronomi birimi" (AB) adı verilen bir uzaklık ölçüsü birimiyle ifade edildiğini belirtir.',
                  '01.02.03 Güneş sistemindeki gezegenlerin belirli yörüngelerde hareket ettiklerini kavrar.',
                  '01.02.04 Güneş sistemindeki gezegenleri, belirgin özelliklerine (birbirlerine göre büyüklükleri, doğal uydu sayıları, etraflarında halka olup olmaması) göre karşılaştırır.',
                  '01.02.05 Güneş sistemini temsil eden bir model oluşturur ve sunar.',
                  '01.02.06 Ay’ın, Dünya’nın uydusu olduğunu gösteren bir model oluşturur ve sunar',
                  '01.02.07 Gök adalara örnekler vererek özelliklerini kavrar.',
                  '01.02.08 Dünya dışındaki evren parçasını "uzay" olarak tanımlar ve Dünya’mızın uzaydaki yerini belirtir.'
                ]
              },
              {
                konu: '01.03 Güneş Sistemi ve Ötesi: Uzay Bilmecesi / Uzay araştırmaları ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '01.03.01 Eski medeniyetlerin gök biliminde nasıl veri topladıkları, kaydettikleri, bunları ne amaçla ve nasıl kullandıkları hakkında bilgi toplayarak bir görüş oluşturur ve sunar.',
                  '01.03.02 Gök bilimcilerin; teleskoplar yardımıyla gök cisimlerinin hareketlerini ve yapısını inceleyen bilim insanları olduklarını belirtir.',
                  '01.03.03 Ünlü Türk gök bilimciler ve çalışmaları hakkında örnekler verir.',
                  '01.03.04 Teleskopların uzay gözlemi yapmadaki önemini fark eder.',
                  '01.03.05 Basit bir teleskop yapmak için teknolojik tasarım yapar, model oluşturur ve sunar.',
                  '01.03.06 Teknolojinin uzay araştırmalarına, uzay araştırmalarının da teknolojiye katkısını örneklerle açıklar.',
                  '01.03.07 Astronotların uzayda pek çok alanda (fizik, kimya, biyoloji, tarım, eczacılık, balistik vb.) incelemeler yapan bilim insanı olduklarını belirtir.',
                  '01.03.08 Ay’a atılan ilk adımın, uzak gezegenlere gidebilme ve uzay araştırmaları bakımından önemini kavrar.',
                  '01.03.09 Evrenin, uçsuz bucaksız olması nedeniyle uzay hakkında bilinen gerçeklerin sınırlı ve yeni araştırmalarla değişebilir olduğunu örneklerle açıklar.',
                  '01.03.10 Uzay çalışmalarına dayanarak ve hayal gücünü kullanarak geleceğe yönelik tahminler yürütür.',
                  '01.03.11 Uzay kirliliğinin sebeplerini ifade ederek bu kirliliğin yol açabileceği olası sonuçları tahmin eder.'
                ]
              },
              {
                konu: '02.01 Işık / Işığın soğurulması ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '02.01.01 Işığın madde ile etkileşimi sonucunda soğurulabileceğini fark eder.',
                  '02.01.02 Işıkla etkileşen maddelerin ısındığını gözlemler.',
                  '02.01.03 Yaptığı gözlemlere dayanarak maddelerin ışığı soğurduğu çıkarımını yapar.',
                  '02.01.04 Koyu renkli cisimlerin ışığı, açık renkli cisimlere göre daha çok soğurduğunu keşfeder.',
                  '02.01.05 Teknolojik tasarım döngüsünü kullanarak ışığı soğuran maddelerin ısınmasıyla ilgili projeler üretir.',
                  '02.01.06 Işığın bir enerji türü olduğunu ifade eder.',
                  '02.01.07 Işık enerjisinin başka bir enerjiye dönüşebileceğini ifade eder.',
                  '02.01.08 Güneş enerjisinden yararlanma yollarına örnekler verir.'
                ]
              },
              {
                konu: '02.02 Işık / Cisimlerin renkli görünmesi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '02.02.01 Beyaz ışığın tüm renkleri içerdiğini fark eder.',
                  '02.02.02 İnsan gözünün fark edemeyeceği ışınların da olduğunu ifade eder.',
                  '02.02.03 Cisimlerin siyah, beyaz veya renkli görünmelerini, ışığın yansıması ve soğurulmasıyla açıklar.',
                  '02.02.04 Cisimlerin beyaz ışıkta ve renkli ışıklarda neden farklı renklerde göründüklerini açıklar.',
                  '02.02.05 Gökyüzünün renkli görünmesini ışığın atmosferde soğurulması ve saçılması ile açıklar.'
                ]
              },
              {
                konu: '02.03 Işık / Işığın saydam bir ortamdan başka bir saydam ortama geçmesi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '02.03.01 Işığın belirli bir yayılma hızının olduğunu ifade eder.',
                  '02.03.02 Işığın hızının saydam bir ortamdan başka bir saydam ortama geçerken değiştiğini ifade eder.',
                  '02.03.03 Işığın saydam bir ortamdan başka bir saydam ortama geçerken doğrultu değiştirdiğini keşfeder.',
                  '02.03.04 Işık demetlerinin az kırıcı (az yoğun) saydam bir ortamdan çok kırıcı (çok yoğun) saydam bir ortama geçerken normale yaklaştığı sonucunu keşfeder.',
                  '02.03.05 Işık demetlerinin çok kırıcı (çok yoğun) saydam bir ortamdan az kırıcı (az yoğun) saydam bir ortama geçerken ise normalden uzaklaştığı sonucunu keşfeder.',
                  '02.03.06 Işığın hem kırıldığı hem de yansıdığı durumlara örnekler verir.',
                  '02.03.07 Çeşitli ortamlarda kırılma olayını açıklamak için basit ışın diyagramları çizer.',
                  '02.03.08 İki ortam arasında doğrultu değiştiren ışık demetlerini gözlemleyerek ortamların yoğunluklarını karşılaştırır.',
                  '02.03.09 Işığın her zaman çok kırıcı (çok yoğun) ortamdan az kırıcı (az yoğun) ortama geçemediğini deneyerek keşfeder.',
                  '02.03.10 Işığın kırılmasıyla açıklanabilecek olaylara örnekler verir.',
                  '02.03.11 Işığın prizmada kırılarak renklere ayrılabileceğini keşfeder.'
                ]
              },
              {
                konu: '02.04 Işık / Mercekler ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '02.04.01 Işığın ince ve kalın kenarlı merceklerde nasıl kırıldığını keşfeder',
                  '02.04.02 Paralel ışık demetleri ile ince ve kalın kenarlı merceklerin odak noktalarını bulur.',
                  '02.04.03 Merceklerin kullanım alanlarına örnekler verir.',
                  '02.04.04 Ormanlık alanlara bırakılan cam atıkların güneşli havalarda yangın riski oluşturabileceğini fark eder.',
                  '02.04.05 Mercekler kullanarak gözlem araçları tasarlar.',
                  '02.04.06 Işığın yansıması ve kırılması olaylarının benzerlik ve farklılıklarını karşılaştırır.'
                ]
              },
              {
                konu: '03.01 İnsan ve Çevre / Organizmaların yaşadıkları alanlar ve bu alanlara insan etkisi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '03.01.01 Tür, habitat, populasyon ve ekosistem kavramlarını örneklerle açıklar.',
                  '03.01.02 Bir ekosistemdeki canlı organizmaların birbirleriyle ve cansız faktörlerle ilişkilerini açıklar.',
                  '03.01.03 Farklı ekosistemlerde bulunabilecek canlılar hakkında tahminler yapar.',
                  '03.01.04 Ekosistemleri canlı çeşitliliği ve iklim özellikleri açısından karşılaştırır.',
                  '03.01.05 Ekosistemdeki biyolojik çeşitliliği fark eder ve bunun önemini vurgular.',
                  '03.01.06 Ülkemizde ve dünyada nesli tükenme tehlikesiyle karşı karşıya olan bitki ve hayvanlara örnekler verir.',
                  '03.01.07 Ülkemizde ve dünyada nesli tükenme tehlikesinde olan bitki ve hayvanların nasıl korunabileceğine ilişkin öneriler sunar.',
                  '03.01.08 Çevresinde bulunan bitki ve hayvanlara sevgiyle davranır.',
                  '03.01.09 Ülkemizdeki ve dünyadaki çevre sorunlarından bir tanesi hakkında bilgi toplar, sunar ve sonuçlarını tartışır.',
                  '03.01.10 Dünyadaki bir çevre probleminin ülkemizi nasıl etkileyebileceğine ilişkin çıkarımlarda bulunur.',
                  '03.01.11 Ülkemizdeki ve dünyadaki çevre sorunlarına yönelik iş birliğine dayalı çözümler önerir ve faaliyetlere katılır.',
                  '03.01.12 Atatürk’ ün çevre sevgisi ile ilgili uygulamalarına örnekler verir.'
                ]
              },
              {
                konu: '04.01 Kuvvet ve Hareket / Sarmal yayların özellikleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '04.01.01 Yayların esneklik özelliği gösterdiğini gözlemler.',
                  '04.01.02 Bir yayı sıkıştıran veya geren cisme, yayın eşit büyüklükte ve zıt yönde bir kuvvet uyguladığını belirtir.',
                  '04.01.03 Bir yayı geren veya sıkıştıran kuvvetin artması durumunda yayın uyguladığı kuvvetin de arttığını fark eder.',
                  '04.01.04 Bir yayın esneklik özelliğini kaybedebileceğini keşfeder.',
                  '04.01.05 Yayların özelliklerini kullanarak bir dinamometre tasarlar ve yapar.'
                ]
              },
              {
                konu: '04.02 Kuvvet ve Hareket / Kuvvet, iş ve enerji ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '04.02.01 Kuvvet, iş ve enerji arasındaki ilişkiyi araştırır.',
                  '04.02.02 Fiziksel anlamda işi tanımlar ve birimini belirtir.',
                  '04.02.03 Bir cisme hareket doğrultusuna dik olarak etki eden kuvvetin, fiziksel anlamda iş yapmadığını ifade eder.',
                  '04.02.04 Enerjiyi iş yapabilme yeteneği olarak tanımlar.',
                  '04.02.05 Hareketli cisimlerin kinetik enerjiye sahip olduğunu fark eder.',
                  '04.02.06 Kinetik enerjinin sürat ve kütle ile olan ilişkisini keşfeder.',
                  '04.02.07 Cisimlerin konumları nedeniyle çekim potansiyel enerjisine sahip olduğunu belirtir.',
                  '04.02.08 Çekim potansiyel enerjisinin cismin ağırlığına ve yüksekliğine bağlı olduğunu keşfeder.',
                  '04.02.09 Bazı cisimlerin esneklik özelliği nedeni ile esneklik potansiyel enerjisine sahip olabileceğini belirtir.',
                  '04.02.10 Sıkıştırılmış veya gerilmiş bir yayın esneklik potansiyel enerjisine sahip olduğunu fark eder',
                  '04.02.11 Yayın esneklik potansiyel enerjisinin yayın sıkışma (veya ,gerilme) miktarı ve yayın esneklik özelliğine bağlı olduğunu keşfeder.',
                  '04.02.12 Potansiyel ve kinetik enerjilerin birbirine dönüşebileceğini örneklerle açıklar.',
                  '04.02.13 Enerji dönüşümlerinden hareketle, enerjinin korunduğu sonucunu çıkarır.',
                  '04.02.14 Çeşitli enerji türlerini araştırır ve bunlar arasındaki dönüşümlere örnekler verir.'
                ]
              },
              {
                konu: '04.03 Kuvvet ve Hareket / Basit makineler ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '04.03.01 Bir kuvvetin yönünün nasıl değiştirilebileceği hakkında tahminlerde bulunur ve tahminlerini test eder.',
                  '04.03.02 Bir kuvvetin yönünü ve/veya büyüklüğünü değiştirmek için kullanılan araçları basit makineler olarak isimlendirir.',
                  '04.03.03 Basit makine kullanarak uygulanan "giriş" kuvvetinden daha büyük bir "çıkış" kuvveti elde edilebileceğini fark eder.',
                  '04.03.04 Bir işi yaparken basit makine kullanmanın enerji tasarrufu sağlamayacağını ,sadece iş yapma kolaylığı sağlayacağını belirtir.',
                  '04.03.05 Belirli bir giriş kuvvetini, en az üç basit makineden oluşan bir bileşik makineye uygulayarak çıkış kuvvetinin büyüklüğünü artıracak bir tasarım yapar.',
                  '04.03.06 Farklı basit makine çeşitlerini araştırarak basit makinelerin geçmişte ve günümüzde insanlığa sunduğu yararları değerlendirir.',
                  '04.03.07 Tasarladığı bileşik makinenin uzun süre kullanıldığında, en çok hangi kısımlarının ne şekilde aşınacağını tahmin eder.'
                ]
              },
              {
                konu: '04.04 Kuvvet ve Hareket / Sürtünme kuvvetinin enerji kaybına yol açması ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '04.04.01 Sürtünen yüzeylerin ısındığını deneylerle gösterir.',
                  '04.04.02 Sürtünme kuvvetinin, kinetik enerjide bir azalmaya sebep olacağını fark eder.',
                  '04.04.03 Kinetik enerjideki azalmayı enerji dönüşümüyle açıklar.',
                  '04.04.04 Hava ve su direncinin de kinetik enerjide bir azalmaya neden olacağı genellemesini yapar.',
                  '04.04.05 Sürtünme kuvvetinin az veya çok olmasının gerekli olduğu yerleri araştırır ve sunar.'
                ]
              },
              {
                konu: '05.01 Maddenin Yapısı ve Özellikleri / Element ve elementlerin sembolleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '05.01.01 Model üzerinde, bir elementin bütün atomlarının aynı olduğunu fark eder.',
                  '05.01.02 Model ve şekilleri kullanarak farklı elementlerin atomlarının farklı olduğunu sezer.',
                  '05.01.03 Periyodik sistemdeki ilk 20 elementi ve günlük hayatta karşılaştığı yaygın element isimlerini listeler.',
                  '05.01.04 Elementleri sembollerle göstermenin bilimsel iletişimi kolaylaştırdığını fark eder.',
                  '05.01.05 İlk 20 elementin ve yaygın elementlerin sembolleri verildiğinde isimlerini, isimleri verildiğinde sembollerini belirtir.'
                ]
              },
              {
                konu: '05.02 Maddenin Yapısı ve Özellikleri / Atomun yapısı ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '05.02.01 Birbiri ile temas halinde olan atomları "bağlı atomlar" şeklinde niteler.',
                  '05.02.02 Sürtme ile elektriklenme olayına dayanarak atomun kendinden daha basit ögelerden oluştuğu çıkarımını yapar.',
                  '05.02.03 Atomun çekirdeğini, çekirdeğin temel parçacıklarını ve elektronları temsilî resimler üzerinde gösterir.',
                  '05.02.04 Elektronu, protonu ve nötronu kütle ve yük açısından karşılaştırır.',
                  '05.02.05 Nötr atomlarda, proton ve elektron sayıları arasında ilişki kurar.',
                  '05.02.06 Aynı elementin atomlarında, proton sayısının (atom numarası) hep sabit olduğunu, nötron sayısının az da olsa değişebileceğini belirtir.',
                  '05.02.07 Aynı atomda, elektronların çekirdekten farklı uzaklıklarda olabileceğini belirtir.',
                  '05.02.08 Çizilmiş atom modelleri üzerinde elektron katmanlarını gösterir, katmanlardaki elektron sayılarını içten dışa doğru sayar.',
                  '05.02.09 Proton sayısı bilinen hafif atomların (Z?20) elektron dizilim modelini çizer.',
                  '05.02.10 Atom modellerinin tarihsel gelişimini kavrar; elektron bulutu modelinin en gerçekçi algılama olacağını fark eder.',
                  '05.02.11 Bilimsel modellerin, gözlenen olguları açıkladığı sürece ve açıkladığı ölçekte geçerli olacağını, modellerin gerçeğe birebir uyma iddiası ve gereği olmadığını fark eder.'
                ]
              },
              {
                konu: '05.03 Maddenin Yapısı ve Özellikleri / Katman- elektron dizilimi ile kimyasal özellikleri ilişkilendirmek ile ilgili bilgileri kavrama ',
                kazanimlar: [
                  '05.03.01 Dış katmanında 8 elektron bulunduran atomların elektron alıp-vermeye yatkın olmadığını (kararlı olduğunu) belirtir.',
                  '05.03.02 Elektron almaya veya vermeye yatkın atomları belirler.',
                  '05.03.03 Bir atomun, katman-elektron diziliminden çıkarak kaç elektron vereceğini veya alacağını tahmin eder.',
                  '05.03.04 Atomların elektron verdiğinde pozitif (+), elektron aldığında ise negatif (-) yük ile yüklendiği çıkarımını yapar.',
                  '05.03.05 Yüklü atomları "iyon" olarak adlandırır.',
                  '05.03.06 Pozitif yüklü iyonları "katyon", negatif yüklü iyonları ise "anyon" olarak adlandırır.',
                  '05.03.07 Çok atomlu yaygın iyonların ad ve formüllerini bilir.'
                ]
              },
              {
                konu: '05.04 Maddenin Yapısı ve Özellikleri / Kimyasal bağ ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '05.04.01 Atomlar arası yakınlık ile kimyasal bağ kavramını ilişkilendirir.',
                  '05.04.02 İyonlar arası çekme/itme kuvvetlerini tahmin eder, çekim kuvvetlerini "iyonik bağ" olarak adlandırır.',
                  '05.04.03 Elektron ortaklaşma yolu ile yapılan bağı "kovalent bağ" olarak adlandırır.',
                  '05.04.04 Asal gazların neden bağ yapmadığını açıklar.',
                  '05.04.05 Elektron ortaklaşma yoluyla oluşan H2, O2, N2 moleküllerinin modelini çizer.',
                  '05.04.06 Molekül yapılı katı element kristal modeli veya modelin resmi üzerinde molekülü ve atomu gösterir.',
                  '05.04.07 Kovalent bağlar ile moleküller arasında ilişki kurar.'
                ]
              },
              {
                konu: '05.05 Maddenin Yapısı ve Özellikleri / Bileşikler ve formülleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '05.05.01 Farklı atomların bir araya gelerek yeni maddeler oluşturabileceğini fark eder.',
                  '05.05.02 Her bileşikte en az iki element bulunduğunu fark eder.',
                  '05.05.03 Molekül yapılı bileşiklerin model veya resmi üzerinde atomları ve molekülleri gösterir.',
                  '05.05.04 Moleküllerde; her elementin atom sayısının, örgü yapılarda; elementlerin atom sayılarının oranını belirler.',
                  '05.05.05 Günlük hayatta sıkça karşılaştığı basit iyonik ve bazı kovalent bileşiklerin formüllerini yazar.',
                  '05.05.06 Element ve bileşiklerin hangilerinin moleküllerden oluştuğuna örnekler verir.'
                ]
              },
              {
                konu: '05.06 Maddenin Yapısı ve Özellikleri / Karışımlar ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '05.06.01 Karışımlarda birden çok element veya bileşik bulunduğunu fark eder',
                  '05.06.02 Heterojen karışım (adi karışım) ile homojen karışım (çözelti) arasındaki farkı açıklar.',
                  '05.06.03 Katı, sıvı ve gaz maddelerin sıvılardaki çözeltilerine örnekler verir.',
                  '05.06.04 Çözeltilerde, çözücü molekülleri ile çözünen maddenin iyon veya molekülleri arasındaki etkileşimlerini açıklar.',
                  '05.06.05 Sıcaklık yükseldikçe çözünmenin hızlandığını fark eder.',
                  '05.06.06 Çözünenin tane boyutu küçüldükçe çözünme hızının artacağını keşfeder.',
                  '05.06.07 Çözeltileri derişik ve seyreltik şeklinde sınıflandırır.',
                  '05.06.08 Çözeltilerin nasıl seyreltileceğini ve/veya deriştirileceğini deneyle gösterir.',
                  '05.06.09 Bazı çözeltilerin elektrik enerjisini ilettiğini deneyle gösterir; elektrolit olan ve elektrolit olmayan maddeler arasındaki farkı açıklar.',
                  '05.06.10 Yağmur ve yüzey sularının kısmen iletken olmasının sebebini ve doğurabileceği tehlikeleri açıklar.'
                ]
              },
              {
                konu: '06.01 Vücudumuzda Sistemler / Sindirim sistemi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '06.01.01 Sindirim sistemini oluşturan yapı ve organları; model, levha ve/ veya şema­ üzerinde gösterir.',
                  '06.01.02 Besinlerin vücuda yararlı hâle gelmesi için değişime uğraması gerektiğini tahmin eder.',
                  '06.01.03 Besinlerin kana geçebilmesi için fiziksel (mekanik) ve kimyasal sindirime uğraması gerektiğini belirtir.',
                  '06.01.04 Enzimin kimyasal sindirimdeki işlevini açıklar.',
                  '06.01.05 Karaciğer ve pankreasın sindirimdeki görevlerini ifade eder.',
                  '06.01.06 Sindirime uğrayan besinlerin bağırsaklardan kana geçişini açıklar.',
                  '06.01.07 Sindirim sistemi sağlığını olumlu-olumsuz etkileyecek etkenleri özetler ve tartışır.'
                ]
              },
              {
                konu: '06.02 Vücudumuzda Sistemler / Boşaltım sistemi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '06.02.01 Boşaltım sistemini oluşturan yapı ve organları; model, levha ve/veya şema üzerinde gösterir.',
                  '06.02.02 Boşaltım sisteminde böbreklerin görevini ve önemini açıklar.',
                  '06.02.03 Boşaltım sistemi sağlığının korunması için alınabilecek önlemlerin farkına varır.',
                  '06.02.04 Bazı böbrek rahatsızlıklarının tedavisinde kullanılan teknolojik gelişmelere örnekler verir.'
                ]
              },
              {
                konu: '06.03 Vücudumuzda Sistemler / Denetleyici ve düzenleyici sistem ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '06.03.01 Denetleyici ve düzenleyici sistemin vücudumuzdaki sistemlerin düzenli ve birbiriyle eş güdümlü çalışmasını sağladığını belirtir.',
                  '06.03.02 Sinir sisteminin bölümlerini; model, levha ve/veya şema üzerinde gösterir.',
                  '06.03.03 Sinir sisteminin bölümlerinin görevlerini açıklar.',
                  '06.03.04 Refleksi gözlemleyecek bir deney tasarlar.',
                  '06.03.05 İç salgı bezlerini; model, levha ve/veya şema üzerinde göstererek görevlerini açıklar.'
                ]
              },
              {
                konu: '06.04 Vücudumuzda Sistemler / Duyu organları ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '06.04.01 Çevremizdeki uyarıları algılamamızda duyu organlarının rolünü fark eder.',
                  '06.04.02 Duyu organlarının yapılarını şekil ve/veya model üzerinde açıklar.',
                  '06.04.03 Duyu organlarının hangi tür uyarıları aldığını ve bunlara nasıl cevap verildiğini açıklar.',
                  '06.04.04 Koku alma ve tat alma arasındaki ilişkiyi deneyle gösterir.',
                  '06.04.05 Duyu organlarındaki aksaklıklara ve teknolojinin bu aksaklıkların giderilmesinde kullanımına örnekler verir.',
                  '06.04.06 Duyu organlarının sağlığını korumak amacı ile alınabilecek önlemlere günlük hayatından örnekler verir.',
                  '06.04.07 Kendini, görme veya işitme engelli kişilerin yerine koyarak onları anlamaya çalışır.'
                ]
              },
              {
                konu: '06.05 Vücudumuzda Sistemler / Vücudumuzdaki sistemler ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '06.05.01 Vücudumuzdaki tüm sistemlerin birlikte ve eş güdümlü çalıştığına örnekler verir.',
                  '06.05.02 Bağımlılığa sebep olan maddelerin sistemlere etkisini araştırır ve sunar.',
                  '06.05.03 Organ bağışının önemini vurgular.',
                  '06.05.04 Sağlık sorunlarıyla birlikte toplumda görevlerini devam ettiren bireyleri takdir eder ve anlayışlı olur.'
                ]
              },
              {
                konu: '07.01 Yaşamımızdaki Elektrik / Elektriklenme ve çeşitleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '07.01.01 Bazı maddelerin veya cisimlerin birbirlerine temas ettirildiğinde elektriklenebileceğini fark eder.',
                  '07.01.02 Aynı yolla elektriklendikten sonra aynı cins iki maddenin birbirlerini dokunmadan ittiğini, farklı cins iki maddenin ise birbirlerini dokunmadan çektiğini deneyerek keşfeder.',
                  '07.01.03 Deneysel sonuçlara dayanarak iki cins elektrik yükü olduğu sonucuna varır.',
                  '07.01.04 Elektrik yüklerinin pozitif (+) ve negatif (-) olarak adlandırıldığını belirtir.',
                  '07.01.05 Aynı elektrik yüklerinin birbirini ittiğini, farklı elektrik yüklerinin ise birbirini çektiğini ifade eder.',
                  '07.01.06 Negatif ve pozitif yüklerin birbirine eşit olduğu cisimleri, nötr cisim olarak adlandırır.',
                  '07.01.07 Yüklü bir cismin başka bir cisme dokundurulunca onu aynı tür yükle yükleyebileceğini ve bu cisimlerin daha sonra birbirini itebileceğini deneyerek keşfeder.',
                  '07.01.08 Elektriklenme olaylarında cisimlerin negatif yük alış-verişi yaptığını ve cisimler üzerinde pozitif veya negatif yük fazlalığı (yük dengesizliği) oluştuğunu ifade eder.',
                  '07.01.09 Elektroskopun ne işe yaradığını, tasarladığı bir araç üzerinde gösterir.',
                  '07.01.10 Yüklü cisimlerden toprağa, topraktan yüklü cisimlere negatif yük akışını "topraklama" olarak adlandırır.',
                  '07.01.11 Cisimlerin birbirine dokundurulmadan etki ile elektriklenerek zıt yükle yüklenebileceğini deneyerek keşfeder.',
                  '07.01.12 Elektriklenmenin teknolojideki ve bazı doğa olaylarındaki uygulamaları hakkında örnekler vererek tartışır.'
                ]
              },
              {
                konu: '07.02 Yaşamımızdaki Elektrik / Elektrik devrelerindeki akım, gerilim ve direnç ilişkisi ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '07.02.01 Elektrik akımının bir çeşit enerji aktarımı olduğunun farkına varır.',
                  '07.02.02 Elektrik enerjisi kaynaklarının, devreye elektrik akımı sağladığını ifade eder.',
                  '07.02.03 Elektrik devrelerinde akımın oluşması için kapalı bir devre olması gerektiğini fark eder.',
                  '07.02.04 Bir elektrik devresindeki akımın yönünün üretecin pozitif kutbundan, negatif kutbuna doğru kabul edildiğini ifade eder ve devre şeması üzerinde çizerek gösterir.',
                  '07.02.05 Ampermetrenin devreye nasıl bağlanacağını devreyi kurarak gösterir.',
                  '07.02.06 Basit elektrik devrelerindeki elektrik akımını ölçmek için ampermetre kullanır ve akım biriminin amper olarak adlandırıldığını ifade eder.',
                  '07.02.07 Gerilimi, bir iletkenin iki ucu arasında akım oluşmasına neden olabilecek enerji farkının bir göstergesi olarak ifade eder.',
                  '07.02.08 Voltmetrenin devreye nasıl bağlanacağını devreyi kurarak gösterir.',
                  '07.02.09 Pillerin, akülerin vb. elektrik enerjisi kaynaklarının kutupları arasındaki gerilimi, voltmetre kullanarak ölçer ve gerilim biriminin volt olarak adlandırıldığını ifade eder.',
                  '07.02.10 Bir devre elemanının uçları arasındaki gerilim ile üzerinden geçen akım arasındaki ilişkiyi deneyerek keşfeder.',
                  '07.02.11 Bir devre elemanının uçları arasındaki gerilimin, üzerinden geçen akıma oranının devre elemanının direnci olarak adlandırıldığını ifade eder.',
                  '07.02.12 Volt/Amper değerini, direnç birimi Ohm’un eş değeri olarak ifade eder.'
                ]
              },
              {
                konu: '07.03 Yaşamımızdaki Elektrik / Ampullerin (dirençlerin) bağlanma şekilleri ile ilgili bilgileri kavrama',
                kazanimlar: [
                  '07.03.01 Ampullerin seri ve paralel bağlandığı durumları devre kurarak gösterir.',
                  '07.03.02 Ampullerin seri ve paralel bağlanması durumunda devredeki farklılıkları deneyerek keşfeder.',
                  '07.03.03 Seri ve paralel bağlı ampullerden oluşan bir devrenin şemasını çizer.',
                  '07.03.04 Ampullerin paralel bağlanmasından oluşan devrelerin avantajlarını ve dezavantajlarını fark eder.',
                  '07.03.05 Seri bağlı devre elemanlarının hepsinin üzerinden aynı akımın geçtiğini fark eder.',
                  '07.03.06 Paralel bağlı devre elemanlarının üzerinden geçen akımların toplamının, ana koldan geçen akıma eşit olduğunu fark eder.',
                  '07.03.07 Ampullerin seri-paralel bağlandığı durumlardaki parlaklığın farklılığının sebebini direnç ile ilişkilendirir.',
                  '07.03.08 Devrede direnci küçük olan koldan yüksek; direnci büyük olan koldan daha düşük akımın geçeceğinin farkına varır.'
                ]
              }
            ]
          },
          {
            sinif: '08',
            konular: [
              {
                konu: '01.01 Canlılar ve Enerji İlişkileri / Besin zincirindeki canlılar',
                kazanimlar: [
                  '01.01.01 Besin zincirlerinin başlangıcında üreticilerin bulunduğu çıkarımını yapar.',
                  '01.01.02 Üreticilerin fotosentez yaparak basit şeker ve oksijen ürettiğini belirtir.',
                  '01.01.03 Fotosentez için nelerin gerekli olduğunu sıralar.',
                  '01.01.04 Fotosentezde ışığın gerekliliğini deney yaparak gözlemler.',
                  '01.01.05 Fotosentezi denklemle ifade eder.',
                  '01.01.06 Fotosentezin canlılar için önemini tartışır.',
                  '01.01.07 Üreticilerin fotosentez ile güneş enerjisini kullanılabilir enerjiye dönüştürdüğünü ifade eder.',
                  '01.01.08 Canlıların yaşamlarını sürdürebilmeleri için enerjiye ihtiyaç duyduklarını açıklar.',
                  '01.01.09 Besin zincirindeki tüketicilerin enerji ihtiyacını üreticilerden karşıladığını açıklar.',
                  '01.01.10 Solunumun canlılar için önemini tartışır.',
                  '01.01.11 Oksijenli solunum sonucunda oluşan ürünleri deney yaparak gösterir.',
                  '01.01.12 Gözlemleri sonucunda oksijenli solunumun denklemini tahmin eder.',
                  '01.01.13 Bazı canlıların yaşamlarını sürdürebilmek için gerekli enerjiyi oksijen kullanmadan sağladığını açıklar.',
                  '01.01.14 Günlük yaşamdan oksijensiz solunum ile ilgili örnekler verir.',
                  '01.01.15 Oksijenli solunum denklemi ile fotosentez denklemini karşılaştırarak ilişki kurar.',
                  '01.01.16 Beslenme ve enerji akışı açısından üreticiler ve tüketiciler arasındaki ilişkiyi açıklar.',
                  '01.01.17 Besin zincirindeki enerji akışına paralel olarak madde döngülerini açıklar.'
                ]
              },
              {
                konu: '01.02 Canlılar ve Enerji İlişkileri /Geri dönüşüm, yenilenebilir ve yenilenemez enerji kaynakları',
                kazanimlar: [
                  '01.02.01 Yenilenebilir ve yenilenemez enerji kaynaklarına örnekler verir.',
                  '01.02.02 Yenilenebilir ve yenilenemez enerji kaynaklarının kullanımına ilişkin araştırma yapar ve sunar.',
                  '01.02.03 Yenilenebilir ve yenilenemez enerji kaynakları kullanmanın önemini vurgular.',
                  '01.02.04 Yenilenebilir enerji kaynaklarının kullanımına örnek olabilecek bir tasarım yapar.',
                  '01.02.05 Geri dönüşümün ne olduğunu ve gerekliliğini örneklerle açıklar.',
                  '01.02.06 Yaşadığı çevrede geri dönüşüm uygulamalarını hayata geçirir.'
                ]
              },
              {
                konu: '02.01 Doğal Süreçler / Dünyamızın oluşum süreci',
                kazanimlar: [
                  '02.01.01 Tarih boyunca Dünya’mızın oluşumu hakkında çeşitli görüşlerin ortaya atıldığını fark eder.',
                  '02.01.02 Dünya’mızın oluşumuyla ilgili olarak en çok kabul gören görüşün, Büyük Patlama olduğunu belirtir.'
                ]
              },
              {
                konu: '02.02 Doğal Süreçler / Bir doğal süreç olan levha hareketleri',
                kazanimlar: [
                  '02.02.01 Yer kabuğunun, sıcak ve akışkan olan magma üzerinde hareket eden levhalardan oluştuğunu gösteren bir model tasarlar ve yapar.',
                  '02.02.02 Okyanusların ve dağların oluşumunu levha hareketleriyle açıklar.',
                  '02.02.03 Artçı deprem, öncü deprem, şiddet, büyüklük, fay kırılması, fay hattı ve deprem bölgesi kavramlarını tanımlar.',
                  '02.02.04 Depremle ilgili çalışmalar yapan bilim dalına sismoloji , bu alanda çalışan bilim insanlarına ise sismolog adı verildiğini belirtir.',
                  '02.02.05 Türkiye’nin deprem bölgeleriyle fay hatları arasında ilişki kurar.',
                  '02.02.06 Depremlere, fayların yanında, volkanik faaliyetlerin ve arazi çöküntülerinin de sebep olabileceğini açıklar.',
                  '02.02.07 Volkanların oluşumunu ve bunun sonucunda oluşan yeryüzü şekillerini levha hareketleriyle açıklar.',
                  '02.02.08 Volkanların ve depremlerin insan hayatındaki etkileri ve sebep olabileceği olumsuz sonuçları ifade eder.',
                  '02.02.09 Deprem tehlikesine karşı alınabilecek önlemleri ve deprem anında yapılması gerekenleri açıklar.'
                ]
              },
              {
                konu: '02.03 Doğal Süreçler / Hava olayları',
                kazanimlar: [
                  '02.03.01 Havanın dört temel bileşen yanında, su buharı da içeren bir karışım olması gerektiği çıkarımını yapar.',
                  '02.03.02 Yakın çevresindeki hava olaylarını gözlemler, sonuçları kaydederek hava olaylarının değişkenliğini fark eder.',
                  '02.03.03 Rüzgârın oluşumunu deneyle keşfeder.',
                  '02.03.04 Rüzgâr ile yel, tayfun, fırtına arasında ilişki kurar.',
                  '02.03.05 Hortum ve kasırganın oluşum şartlarını ifade eder.',
                  '02.03.06 Havanın sıcaklığı arttıkça daha fazla nem kaldırabileceğini ifade eder.',
                  '02.03.07 Yağmur, kar, dolu, sis, çiğ ve kırağı ile havanın sıcaklığı ve nemi arasında ilişki kurar.',
                  '02.03.08 Hava olaylarının sebebini günlük sıcaklık farklılıkları ve oluşan alçak ve yüksek basınç alanlarıyla açıklar.',
                  '02.03.09 Mevsimsel sıcaklık değişimlerinin sebebini, Dünya’nın dönme ekseninin eğikliği ile açıklar.',
                  '02.03.10 Yeryüzü şekillerinin oluşumu ve değişiminde hava olaylarının etkisini örneklerle açıklar.',
                  '02.03.11 İklimin, yeryüzünün herhangi bir yerinde uzun yıllar boyunca gözlenen tüm hava olaylarının ortalama durumu olduğunu ifade eder ve iklimlerin zamanla değişebileceğini kavrar.',
                  '02.03.12 İklimin etkisini açıklamaya ve keşfetmeye çalışan bilim insanlarına iklim bilimci adı verildiğini belirtir.',
                  '02.03.13 Meteorolojinin, atmosfer içinde oluşan sıcaklık değişmelerini ve buna bağlı olarak oluşan hava olaylarını inceleyerek hava tahminleri yapan bilim dalı olduğunu ifade eder.',
                  '02.03.14 Hava tahminlerinin günlük yaşantımızdaki yeri ve önemini fark eder.',
                  '02.03.15 Meteoroloji uzmanlarına meteorolog adı verildiğini belirtir.'
                ]
              },
              {
                konu: '03.01 Hücre Bölünmesi ve Kalıtım / Mitoz',
                kazanimlar: [
                  '03.01.01 Canlılarda büyüme ve üremenin hücre bölünmesi ile meydana geldiğini açıklar',
                  '03.01.02 Mitozu, çekirdek bölünmesi ile başlayan ve birbirini takip eden evreler olarak tarif eder.',
                  '03.01.03 Mitozda kromozomların önemini fark ederek farklı canlı türlerinde kromozom sayılarının değişebileceğini belirtir.',
                  '03.01.04 Mitozun canlılar için önemini belirterek büyüme ve üreme ile ilişkilendirir.'
                ]
              },
              {
                konu: '03.02 Hücre Bölünmesi ve Kalıtım / Kalıtım',
                kazanimlar: [
                  '03.02.01 Gözlemleri sonucunda kendisi ile anne-babası arasındaki benzerlik ve farklılıkları karşılaştırır.',
                  '03.02.02 Yavruların anne-babaya benzediği, ama aynısı olmadığı çıkarımını yapar.',
                  '03.02.03 Mendel’in çalışmalarının kalıtım açısından önemini irdeler.',
                  '03.02.04 Gen kavramı hakkında bilgi toplayarak baskın ve çekinik genleri fark eder.',
                  '03.02.05 Fenotip ve genotip arasındaki ilişkiyi kavrar.',
                  '03.02.06 Tek karakterin kalıtımı ile ilgili problemler çözer.',
                  '03.02.07 İnsanlarda yaygın olarak görülen bazı kalıtsal hastalıklara örnekler verir.',
                  '03.02.08 Akraba evliliğinin sakıncaları ile ilgili bilgi toplar ve sunar.',
                  '03.02.09 Akraba evliliğinin olumsuz sonuçlarını yakın çevresiyle paylaşır ve tartışır.',
                  '03.02.10 Genetik hastalıkların teşhis ve tedavisinde bilimsel ve teknolojik gelişmelerin etkisini araştırır ve sunar.'
                ]
              },
              {
                konu: '03.03 Hücre Bölünmesi ve Kalıtım / Mayoz',
                kazanimlar: [
                  '03.03.01 Üreme hücrelerinin mayoz ile oluştuğu çıkarımını yapar.',
                  '03.03.02 Mayozun canlılar için önemini fark eder.',
                  '03.03.03 Mayozu, mitozdan ayıran özellikleri listeler.'
                ]
              },
              {
                konu: '03.04 Hücre Bölünmesi ve Kalıtım / DNA ve genetik bilgi',
                kazanimlar: [
                  '03.04.01 Kalıtsal bilginin genler tarafından taşındığını fark eder.',
                  '03.04.02 DNA’nın yapısını şema üzerinde göstererek basit bir DNA modeli yapar.',
                  '03.04.03 DNA’nın kendini nasıl eşlediğini basit bir model yaparak gösterir.',
                  '03.04.04 Nükleotit, gen, DNA, kromozom kavramları arasında ilişki kurar.',
                  '03.04.05 Mutasyon ve modifikasyonu tanımlayarak aralarındaki farkı örneklerle açıklar.',
                  '03.04.06 Genetik mühendisliğinin günümüzdeki uygulamaları ile ilgili bilgileri özetler ve tartışır.',
                  '03.04.07 Genetik mühendisliğindeki gelişmelerin insanlık için doğurabileceği sonuçları tahmin eder.',
                  '03.04.08 Genetik mühendisliğindeki gelişmelerin olumlu sonuçlarını takdir eder.',
                  '03.04.09 Biyoteknolojik çalışmaların hayatımızdaki önemi ile ilgili bilgi toplayarak çalışma alanlarına örnekler verir.'
                ]
              },
              {
                konu: '03.05 Hücre Bölünmesi ve Kalıtım / Canlıların çevreye adaptasyonu ve evrim',
                kazanimlar: [
                  '03.05.01 Canlıların yaşadıkları çevreye adaptasyonunu örneklerle açıklar.',
                  '03.05.02 Aynı yaşam alanında bulunan farklı organizmaların, neden benzer adaptasyonlar geliştirdiğini belirtir.',
                  '03.05.03 Canlıların çevresel değişimlere adaptasyonlarının biyolojik çeşitliliğe ve evrime katkıda bulunabileceğine örnekler verir.',
                  '03.05.04 Evrim ile ilgili farklı görüşlere örnekler verir.'
                ]
              },
              {
                konu: '04.01 Kuvvet ve Hareket / Sıvıların ve gazların kaldırma kuvveti',
                kazanimlar: [
                  '04.01.01 Bir cismin havadaki ve sıvı içindeki ağırlığını dinamometre ile ölçer ve ölçümlerini kaydeder.',
                  '04.01.02 Cismin havadaki ve sıvı içindeki ağırlıklarını karşılaştırır.',
                  '04.01.03 Cismin sıvı içindeki ağırlığının daha az göründüğü sonucunu çıkarır.',
                  '04.01.04 Sıvı içindeki cisme, sıvı tarafından yukarı yönde bir kuvvet uygulandığını fark eder ve bu kuvveti kaldırma kuvveti olarak tanımlar.',
                  '04.01.05 Kaldırma kuvvetinin, cisme aşağı yönde etki eden kuvvetin etkisini azalttığı sonucuna varır.',
                  '04.01.06 Bir cisme etki eden kaldırma kuvvetinin büyüklüğünün, cismin batan kısmının hacmi ile ilişkisini araştırır.',
                  '04.01.07 Bir cisme etki eden kaldırma kuvvetinin büyüklüğünün, cismin daldırıldığı sıvının yoğunluğu ile ilişkisini araştırır.',
                  '04.01.08 Farklı yoğunluğa sahip sıvıların cisimlere uyguladığı kaldırma kuvvetini karşılaştırır ve sonuçları yorumlar',
                  '04.01.09 Gazların da cisimlere bir kaldırma kuvveti uyguladığını keşfeder.',
                  '04.01.10 Sıvıların ve gazların kaldırma kuvvetinin teknolojideki kullanımına örnekler verir ve bunların günlük hayattaki önemini belirtir.'
                ]
              },
              {
                konu: '04.02 Kuvvet ve Hareket / Sıvı içinde yüzen ve batan cisimler',
                kazanimlar: [
                  '04.02.01 Cisimlerin kütlesini ve hacmini ölçerek yoğunluklarını hesaplar.',
                  '04.02.02 Bir cismin yoğunluğu ile daldırıldığı sıvının yoğunluğunu karşılaştırarak yüzme ve batma olayları için bir genelleme yapar.',
                  '04.02.03 Denge durumunda, yüzen bir cisme etki eden kaldırma kuvvetinin cismin ağırlığına eşit olduğunu fark eder.',
                  '04.02.04 Batan bir cisme etki eden kaldırma kuvvetinin, cismin ağırlığından daha küçük olduğunu fark eder.',
                  '04.02.05 Bir cisme etki eden kaldırma kuvvetinin, cismin yer değiştirdiği sıvının ağırlığına eşit büyüklükte ve yukarı yönde olduğunu keşfeder.'
                ]
              },
              {
                konu: '04.03 Kuvvet ve Hareket / Basınç',
                kazanimlar: [
                  '04.03.01 Birim yüzeye etki eden dik kuvveti, basınç olarak ifade eder.',
                  '04.03.02 Basınç, kuvvet ve yüzey alanı arasındaki ilişkiyi örneklerle açıklar.',
                  '04.03.03 Basınca sebep olan kuvvetin çeşitli etkenlerden kaynaklanabileceğini fark eder.',
                  '04.03.04 Sıvıların ve gazların, basıncı, her yönde aynı büyüklükte ilettiğini keşfeder.',
                  '04.03.05 Sıvıların ve gazların, basıncı iletme özelliklerinin teknolojideki kullanım alanlarını araştırır.',
                  '04.03.06 Basıncın, günlük hayattaki önemini açıklar ve teknolojideki uygulamalarına örnekler verir.'
                ]
              },
              {
                konu: '05.01 Maddenin Yapısı ve Özellikleri / Periyodik sistem',
                kazanimlar: [
                  '05.01.01 Elementleri benzer özelliklerine göre sınıflandırmanın önemini kavrar.',
                  '05.01.02 Periyodik sistemde grupları ve periyotları gösterir; aynı gruplardaki elementlerin özelliklerini karşılaştırır.',
                  '05.01.03 Metal, ametal ve yarı metal özelliklerini karşılaştırır.',
                  '05.01.04 Periyodik tablonun sol tarafında daha çok metallerin, sağ tarafında ise daha çok ametallerin bulunduğunu fark eder.',
                  '05.01.05 Metallerin, ametallerin ve yarı metallerin günlük yaşamdaki kullanım alanlarına örnekler verir.'
                ]
              },
              {
                konu: '05.02 Maddenin Yapısı ve Özellikleri / Kimyasal tepkimeler',
                kazanimlar: [
                  '05.02.01 Yükü bilinen iyonların oluşturduğu bileşiklerin formüllerini yazar.',
                  '05.02.02 Çok atomlu yaygın iyonların oluşturduğu bileşiklerin (Mg(NO3)2, Na3PO4 gibi) formüllerinde element atomlarının sayısını hesaplar.',
                  '05.02.03 Kimyasal bir tepkimenin gerçekleştiğini gösteren deneyle gösterir.',
                  '05.02.04 Kimyasal değişimi atomlar arası bağların kopması ve yeni bağların oluşması temelinde açıklar.',
                  '05.02.05 Kimyasal değişimlerde atomların yok olmadığını ve yeni atomların oluşmadığını, kütlenin korunduğunu belirtir.',
                  '05.02.06 Basit kimyasal tepkime denklemlerini sayma yöntemi ile denkleştirir.',
                  '05.02.07 Yanma tepkimelerini tanımlayarak basit yanma tepkimelerini formüllerle gösterir.'
                ]
              },
              {
                konu: '05.03 Maddenin Yapısı ve Özellikleri / Asit-baz tepkimeleri',
                kazanimlar: [
                  '05.03.01 Asitleri ve bazları; dokunma, tatma ve görme duyuları ile ilgili özellikleriyle tanır.',
                  '05.03.02 Asitler ile H+ iyonu; bazlar ile OH- iyonu arasında ilişki kurar.',
                  '05.03.03 pH’ın, bir çözeltinin ne kadar asidik veya ne kadar bazik olduğunun bir ölçüsü olduğunu anlar ve asitlik-bazlık ile pH skalası arasında ilişki kurar.',
                  '05.03.04 Sanayide kullanılan başlıca asitleri ve bazları; piyasadaki adları, sistematik adları ve formülleri ile tanır.',
                  '05.03.05 Gıdalarda ve temizlik malzemelerinde yer alan en yaygın asit ve bazları isimleriyle tanır.',
                  '05.03.06 Günlük yaşamında sık karşılaştığı bazı ürünlerin pH’larını yaklaşık olarak bilir.',
                  '05.03.07 Asitler ile bazların etkileşimini deney ile gösterir, bu etkileşimi nötralleşme tepkimesi olarak adlandırır, nötralleşme sonucu neler oluştuğunu belirtir.',
                  '05.03.08 Asit-baz çözeltilerini kullanırken neden dikkatli olması gerektiğini açıklar; kimyasal maddeler için tehlike işaretlerinin anlamlarını belirtir.',
                  '05.03.09 Asitlerin ve bazların günlük kullanımdaki eşya ve malzemeler üzerine olumsuz etkisinden kaçınmak için neler yapılabileceğini açıklar.',
                  '05.03.10 Endüstride atık madde olarak havaya bırakılan SO2 ve NO2 gazlarının asit yağmurları oluşturduğunu ve bunların çevreye zarar verdiğini fark eder.',
                  '05.03.11 Suları, havayı ve toprağı kirleten kimyasallara karşı duyarlılık edinir.'
                ]
              },
              {
                konu: '05.04 Maddenin Yapısı ve Özellikleri / Su kimyası ve su arıtımı',
                kazanimlar: [
                  '05.04.01 Sert su, yumuşak su kavramlarını anlar ve sertliğin neden istenmeyen bir özellik olduğunu açıklar.',
                  '05.04.02 Sularda sertliğin nasıl giderileceğini araştırır.',
                  '05.04.03 Suların arıtımında klorun mikrop öldürücülük etkisinden yararlanıldığını araştırarak fark eder.'
                ]
              },
              {
                konu: '05.05 Maddenin Yapısı ve Özellikleri / Kimyasal bağlar',
                kazanimlar: [
                  '05.05.01 Metallerin elektron vermeye, ametallerin elektron almaya yatkın olduğunu fark eder.',
                  '05.05.02 Anyonların ve katyonların periyodik sistemdeki grup numaraları ile yükleri arasında ilişki kurar.',
                  '05.05.03 Metal atomları ile ametal atomları arasında iyonik bağ oluşacağını tahmin eder.',
                  '05.05.04 Ametal atomları arasında kovalent bağ oluştuğunu belirtir.',
                  '05.05.05 Verilen basit yapılarda hangi tür bağların (iyonik bağ veya kovalent bağ) bulunduğunu tahmin eder.'
                ]
              },
              {
                konu: '07.01 Maddenin Halleri ve Isı / Isı ve sıcaklık',
                kazanimlar: [
                  '07.01.01 Isının, sıcaklığı yüksek maddeden sıcaklığı düşük olan maddeye aktarılan enerji olduğunu belirtir.',
                  '07.01.02 Aynı maddenin kütlesi büyük bir örneğini belirli bir sıcaklığa kadar ısıtmak için, kütlesi daha küçük olana göre, daha çok ısı gerektiğini keşfeder.',
                  '07.01.03 Tek tek moleküllerin hareket enerjilerinin farklı olabileceğini ve çarpışmalarla değişeceğini fark eder.',
                  '07.01.04 Sıcaklığı, moleküllerin ortalama hareket enerjisinin göstergesi şeklinde yorumlar.',
                  '07.01.05 Bir kova kaynar su ve bir bardak kaynar suyun sıcaklıklarını ve kaynatmak için gerekli ısı miktarlarını tahmin ederek karşılaştırır.',
                  '07.01.06 Bir kova soğuk su ve bir bardak ılık suyun sıcaklıklarını ve aldıkları ısı miktarlarını tahmin ederek karşılaştırır.',
                  '07.01.07 Isı aktarım yönü ile sıcaklık arasında ilişki kurar.',
                  '07.01.08 Sıvı termometrelerin nasıl yapıldığını keşfeder.'
                ]
              },
              {
                konu: '07.02 Maddenin Halleri ve Isı / Maddelerin aldığı-verdiği ısı ile sıcaklık değişimi arasındaki ilişki',
                kazanimlar: [
                  '07.02.01 Mekanik ve Elektrik enerjinin ısıya dönüştüğünü gösteren deneyler tasarlar.',
                  '07.02.02 Maddelerin ısınmasının enerji almaları anlamına geldiğini belirtir.',
                  '07.02.03 Suyun ve diğer maddelerin öz ısı larını tanımlar, sembolle gösterir.',
                  '07.02.04 Farklı maddelerin öz ısılarının farklı olduğunu (öz ısının ayırt edici bir özellik olduğunu) belirtir.',
                  '07.02.05 Suyun öz ısısını joule/goC ve kalori/goC cinsinden belirtir.'
                ]
              },
              {
                konu: '07.03 Maddenin Halleri ve Isı / Maddenin ısı alış-verişi ile hâl değişimlerini ilişkilendirmek',
                kazanimlar: [
                  '07.03.01 Gaz, sıvı ve katı maddelerde moleküllerin/atomların yakınlık derecesi, bağ sağlamlığı ve hareket özellikleri arasındaki ilişkiyi model veya resim üzerinde açıklar.',
                  '07.03.02 Bağların, katılarda sıvılardakinden daha sağlam olduğu çıkarımını yapar.',
                  '07.03.03 Gazlarda moleküller arasındaki bağların yok denecek kadar zayıf olduğunu belirtir.',
                  '07.03.04 Erimenin ve buharlaşmanın ısı gerektirmesini, donmanın ve yoğuşmanın ısı açığa çıkarmasını bağların kopması ve oluşması temelinde açıklar.'
                ]
              },
              {
                konu: '07.04 Maddenin Halleri ve Isı / Erime-donma ısısı',
                kazanimlar: [
                  '07.04.01 Erimenin neden ısı gerektirdiğini açıklar; donma ısısı ile ilişkilendirir.',
                  '07.04.02 Farklı maddelerin erime ısılarını karşılaştırır.',
                  '07.04.03 Belli kütledeki buzun, erime sıcaklığında, tamamen suya dönüşmesi için gerekli ısı miktarını hesaplar.',
                  '07.04.04 Kapalı mekânların aşırı soğumasını önlemek için ortama su konulmasının yararını açıklar.',
                  '07.04.05 Saf olmayan suyun donma noktasının, saf sudan daha düşük olduğunu fark eder.',
                  '07.04.06 Buzlanmayı önlemek için başvurulan tuzlama işleminin hangi ilkeye dayandığını açıklar.',
                  '07.04.07 Atatürk’ün bilim ve teknolojiye verdiği önemi açıklar.'
                ]
              },
              {
                konu: '07.05 Maddenin Halleri ve Isı / Buharlaşma ısısı',
                kazanimlar: [
                  '07.05.01 Buharlaşmanın neden ısı gerektirdiğini açıklar; buharlaşma ısısını maddenin türü ile ilişkilendirir.',
                  '07.05.02 Kütlesi belli suyun, kaynama sıcaklığında tamamen buhara dönüşmesi için gerekli ısı miktarını hesaplar.',
                  '07.05.03 Buharlaşmanın soğutma amacı ile kullanılışına günlük hayattan örnekler verir.'
                ]
              },
              {
                konu: '07.06 Maddenin Halleri ve Isı / Isınma-soğuma eğrileri',
                kazanimlar: [
                  '07.06.01 Katı, sıvı ve buhar hâlleri kolay elde edilebilir (su gibi) maddeleri ısıtıp-soğutarak, sıcaklık-zaman verilerini grafiğe geçirir.',
                  '07.06.02 Isınan-soğuyan maddelerin, sıcaklık-zaman grafiklerini yorumlar; hâl değişimleri ile ilişkilendirir.'
                ]
              },
              {
                konu: '08.01 Ses/ Ses Dalgaları',
                kazanimlar: [
                  '08.01.01 Titreşen bir cisim için frekans ve genliği tanımlar.',
                  '08.01.02 Ses dalgasının belirli bir frekansı ve genliği olduğunu ifade eder.'
                ]
              },
              {
                konu: '08.02 Ses/ Sesin özellikleri',
                kazanimlar: [
                  '08.02.01 Çevresindeki sesleri, ince-kalın ve şiddetli-zayıf sıfatlarını kullanarak betimler ve sınıflandırır.',
                  '08.02.02 Ses şiddetini, sesleri şiddetli veya zayıf işitmemize neden olan ses özelliği olarak ifade eder.',
                  '08.02.03 Ses yüksekliğini, sesleri ince veya kalın işitmemize neden olan ses özelliği olarak ifade eder.',
                  '08.02.04 Sesin şiddeti ile genliği, sesin yüksekliği ile frekansı arasındaki ilişkiyi keşfeder.',
                  '08.02.05 Çeşitli sesleri birbirinden ayırt edilebilmesini, ses dalgalarının frekans ve genliklerinin farklı olmasıyla açıklar.',
                  '08.02.06 Ses düzeyinin ses şiddetinin bir ölçüsü olduğunu fark eder.',
                  '08.02.07 Çevresindeki ses kaynaklarının ürettiği sesler ile ses düzeyleri arasında ilişki kurar.'
                ]
              },
              {
                konu: '08.03 Ses/ Bir müzik aletinden çıkan sesin değişimi',
                kazanimlar: [
                  '08.03.01 Bir müzik aletinden çıkan seslerin yüksekliğini ve şiddetini nasıl değiştirebileceğini keşfeder.',
                  '08.03.02 Farklı yükseklik ve şiddette sesler oluşturabileceği bir müzik aleti tasarlar ve yapar.'
                ]
              },
              {
                konu: '08.04 Ses / Bir enerji türü olan ses',
                kazanimlar: [
                  '08.04.01 Sesin bir enerji türü olduğunu ifade eder.',
                  '08.04.02 Ses enerjisinin başka bir enerjiye dönüşebileceğini ifade eder.'
                ]
              },
              {
                konu: '08.05 Ses / Sesin yayılma hızı',
                kazanimlar: [
                  '08.05.01 Ses dalgalarının belirli bir yayılma hızının olduğunu ve bu hızın, sesin yayıldığı ortamın yoğunluğuna bağlı olarak değiştiğini ifade eder.',
                  '08.05.02 Sesin farklı ortamlardaki hızlarını karşılaştırır.',
                  '08.05.03 Işığın ve sesin havadaki yayılma hızlarını karşılaştırır.'
                ]
              },
              {
                konu: '09.01 Yaşamımızdaki Elektrik / Elektrik akımının manyetik etkisi ve elektrik enerjisinin hareket enerjisine dönüşümü',
                kazanimlar: [
                  '09.01.01 Üzerinden akım geçen bir bobinin, bir çubuk mıknatıs gibi davrandığını fark eder.',
                  '09.01.02 Bir elektromıknatıs yaparak kutuplarını akımın geçiş yönünden faydalanarak bulur.',
                  '09.01.03 Üzerinden akım geçen bobinin merkezinde oluşan manyetik etkinin, bobinden geçen akım ve bobinin sarım sayısı ile değiştiğini deneyerek keşfeder.',
                  '09.01.04 Elektrik akımının manyetik etkisinin, günlük hayatta kullanıldığı yerleri araştırır ve sunar.',
                  '09.01.05 Elektrik enerjisinin hareket enerjisine dönüştüğünü fark eder.',
                  '09.01.06 Bir çubuk mıknatısın hareketinin, elektrik akımı oluşturduğunu deneyerek keşfeder.',
                  '09.01.07 Hareket enerjisinin elektrik enerjisine dönüştüğünü fark eder.',
                  '09.01.08 Güç santrallerinde elektrik enerjisinin nasıl üretildiği hakkında araştırma yapar ve sunar.'
                ]
              },
              {
                konu: '09.02 Yaşamımızdaki Elektrik / Elektrik enerjisinin ısı enerjisine ve ışık enerjisine dönüşümü',
                kazanimlar: [
                  '09.02.01 Elektrik akımı geçen iletkenlerin ısındığını deneyerek fark eder',
                  '09.02.02 Elektrik enerjisinin bir iletkende ısı enerjisine dönüşeceği sonucuna varır.',
                  '09.02.03 Üzerinden akım geçen bir iletkende açığa çıkan ısının; iletkenin direnci, üzerinden geçen akım ve akımın geçiş süresiyle ilişkili olduğunu deneyerek keşfeder.',
                  '09.02.04 Elektrik enerjisinin ısı enerjisine dönüşümünü temel alan teknolojik uygulamaları araştırır ve sunar.',
                  '09.02.05 Güvenlik açısından sigortanın önemini ve çalışma prensibini açıklar.',
                  '09.02.06 Teknolojideki sigorta modellerini araştırarak bir sigorta modeli tasarlar.',
                  '09.02.07 Elektrik enerjisinin ışık enerjisine dönüştüğünü fark eder.',
                  '09.02.08 Üzerinden akım geçen bazı iletkenlerin görülebilir bir ışık yaydığı çıkarımını yapar.',
                  '09.02.09 Bir ampulün patladığında neden tekrar yanmadığını yorumlar.'
                ]
              },
              {
                konu: '09.03 Yaşamımızdaki Elektrik / Elektrik enerjisinin kullanımı ve elektriksel güç',
                kazanimlar: [
                  '09.03.01 Elektrik enerjisi ile çalışan araçların birim zamanda kullandıkları elektrik enerjisi miktarının farklı olabileceğini fark eder.',
                  '09.03.02 Elektrik enerjisi ile çalışan araçların birim zamanda tükettiği elektrik enerjisini, o aracın gücü olarak ifade eder.',
                  '09.03.03 Elektriksel güç birimlerinin watt ve kilowatt olarak adlandırıldığını ifade eder.',
                  '09.03.04 Elektrik enerjisi ile çalışan araçlarda kullanılan elektrik enerjisi miktarının, aracın gücüne ve çalıştırıldığı süreye göre değiştiğini fark eder.',
                  '09.03.05 Kullanılan elektrik enerjisi miktarının watt x saniye ve kilowatt x saat olarak adlandırıldığını ifade eder.',
                  '09.03.06 Elektrik enerjisinin bilinçli bir şekilde kullanımı için alınması gereken önlemleri ifade eder.'
                ]
              }
            ]
          }
        ]
      },
      {
        ders: 'Türkçe',
        isim: 'Hava',
        slug: 'hava',
        muhurler: [
          {isim: 'Karçıga', slugYeni: 'karciga', seviye: 'gumus', slug: 'akbaba'},
          {isim: 'Alak', slugYeni: 'alak', seviye: 'gumus', slug: 'atmaca'},
          {isim: 'Kıyga', slugYeni: 'kiyga', seviye: 'gumus', slug: 'baykus'},
          {isim: 'Toygar', slugYeni: 'toygar', seviye: 'gumus', slug: 'guvercin'},
          {isim: 'Ürgan', slugYeni: 'urgan', seviye: 'gumus', slug: 'kanarya'},
          {isim: 'Çalkın', slugYeni: 'calkin', seviye: 'gumus', slug: 'karga'},
          {isim: 'Karatal', slugYeni: 'karatal', seviye: 'gumus', slug: 'kartal'},
          {isim: 'Çağaş', slugYeni: 'cagas', seviye: 'gumus', slug: 'kirlangic'},
          {isim: 'Kavçın', slugYeni: 'kavcin', seviye: 'gumus', slug: 'leylek'},
          {isim: 'Yuğak', slugYeni: 'yugak', seviye: 'gumus', slug: 'pelikan'},
          {isim: 'Çakır', slugYeni: 'cakir', seviye: 'altin', slug: 'akbaba'},
          {isim: 'Duvan', slugYeni: 'duvan', seviye: 'altin', slug: 'atmaca'},
          {isim: 'Bilgen', slugYeni: 'bilgen', seviye: 'altin', slug: 'baykus'},
          {isim: 'Akhan', slugYeni: 'akhan', seviye: 'altin', slug: 'guvercin'},
          {isim: 'Çelek', slugYeni: 'celek', seviye: 'altin', slug: 'kanarya'},
          {isim: 'Tülgü', slugYeni: 'tulgu', seviye: 'altin', slug: 'karga'},
          {isim: 'İlkuş', slugYeni: 'ilkus', seviye: 'altin', slug: 'kartal'},
          {isim: 'Babrak', slugYeni: 'babrak', seviye: 'altin', slug: 'kirlangic'},
          {isim: 'Göçer', slugYeni: 'gocer', seviye: 'altin', slug: 'leylek'},
          {isim: 'Algur', slugYeni: 'algur', seviye: 'altin', slug: 'pelikan'}
        ],
        mufredat: [
          {
            sinif: '05',
            konular: [
              {
                konu: '02.01 Görsel Okuma',
                kazanimlar: [
                  '02.01.01 Şekil, sembol ve işaretlerin anlamlarını bilir.',
                  '02.01.03 Resim ve fotoğrafları yorumlar.',
                  '02.01.04 Karikatürde verilen mesajı algılar.',
                  '02.01.09 Renkleri tanır, anlamlandırır ve yorumlar.',
                  '02.01.11 Grafik ve tablo ile verilenleri yorumlar.',
                  '02.01.12 Harita ve kroki okur.',
                  '02.01.14 Trafik işaretlerinin anlamlarını bilir.'
                ]
              },
              {
                konu: '06.02 Okuma / Okuduğunu Anlama',
                kazanimlar: [
                  '06.02.01 Ön bilgilerini kullanarak okuduğunu anlamlandırır.',
                  '06.02.02 Metinde verilen ipuçlarından hareketle karşılaştığı yeni kelimelerin anlamlarını tahmin eder.',
                  '06.02.03 Okuma öncesi, okuma sırası ve sonrasında metinle ilgili soruları cevaplandırır.',
                  '06.02.04 Metnin giriş, gelişme ve sonuç bölümleri hakkında tahminlerde bulunur.',
                  '06.02.07 Okuduklarında ne, nerede, ne zaman, nasıl, niçin ve kim (5N 1K) sorularına cevap arar.',
                  '06.02.08 Farklı düşünmeye yönlendiren ifadeleri dikkate alarak okur.',
                  '06.02.09 Önem belirten ifadeleri dikkate alarak okur.',
                  '06.02.10 Okuduklarında karşılaştırmalar yapar.',
                  '06.02.11 Okuduklarında sebep-sonuç ilişkileri kurar.',
                  '06.02.12 Betimleyen ve tanımlayan ifadeleri dikkate alarak okur.',
                  '06.02.13 Genel ve özel durumları bildiren ifadeleri dikkate alarak okur.',
                  '06.02.14 Destekleyici ve açıklayıcı ifadeleri dikkate alarak okur.',
                  '06.02.15 Özetleyen ve sonuç bildiren ifadeleri dikkate alarak okur.',
                  '06.02.16 Okuduklarında gerçek olanla hayal ürünü olanı ayırt eder.',
                  '06.02.17 Okuduğu metindeki öznel ve nesnel yargıları ayırt eder.',
                  '06.02.18 Okuduklarının konusunu belirler.',
                  '06.02.19 Okuduğunun ana fikrini belirler.',
                  '06.02.20 Okuduklarında yardımcı fikirleri ve destekleyici ayrıntıları belirler.',
                  '06.02.21 Okuduğu şiirin ana duygusunu belirler.',
                  '06.02.22 Okumasını, metnin içeriğini ve okuma ortamını değerlendirir.',
                  '06.02.23 Başlıktan hareketle okuyacağı metnin içeriğini tahmin eder.',
                  '06.02.25 Metindeki anlam bakımından çelişkili ifadeleri saptar.',
                  '06.02.26 Okuduklarından çıkarımlar yapar.',
                  '06.02.32 Okuduklarında "hikâye unsurları"nı belirler.',
                  '06.02.33 Yazarın amacını belirler.',
                  '06.02.35 Okuduklarında geçen varlıkları ve olayları sınıflandırır.',
                  '06.02.37 Görsellerden yararlanarak metnin içeriğini tahmin eder.',
                  '06.02.38 Okuduklarında eksik bırakılan ve konuyla ilgisi olmayan bilgiyi fark eder.',
                  '06.02.39 Okuduklarındaki dil, ifade ve bilgi yanlışlarını belirler.'
                ]
              },
              {
                konu: '06.03 Okuma / Anlam Kurma',
                kazanimlar: [
                  '06.03.01 Metin içi anlam kurar.',
                  '06.03.02 Metin dışı anlam kurar.',
                  '06.03.03 Metinler arası anlam kurar.'
                ]
              },
              {
                konu: '06.04 Okuma / Söz Varlığını Geliştirme',
                kazanimlar: [
                  '06.04.01 Görsellerden yararlanarak söz varlığını geliştirir.',
                  '06.04.02 Kelimelerin eş ve zıt anlamlılarını bulur.',
                  '06.04.03 Eş sesli kelimelerin anlamlarını ayırt eder.',
                  '06.04.04 Bilmediği kelimelerin anlamlarını araştırır.',
                  '06.04.05 Ekleri kullanarak kelimeler türetir.',
                  '06.04.06 Kelimelerin gerçek, mecaz ve terim anlamlarını ayırt eder.'
                ]
              },
              {
                konu: '07.01 Yazma / Yazma Kurallarını Uygulama',
                kazanimlar: [
                  '07.01.07 Yazılarında noktalama işaretlerini doğru ve yerinde kullanır.',
                  '07.01.08 Yazılarında imlâ kurallarını uygular.',
                ]
              }
            ]
          },
          {
            sinif: '06',
            konular: [
              {
                konu: '02.01 Dil Bilgisi /Kelimenin yapı özellikleriyle ilgili bilgi ve kuralları kavrama ve uygulama',
                kazanimlar: [
                  '02.01.01 Kök ve eki kavrar.',
                  '02.01.02 İsim kökü ile fiil kökünü ayırt eder.',
                  '02.01.03 Yapım eki ile çekim ekini ayırt eder.',
                  '02.01.04 Gövdeyi kavrar.',
                  '02.01.05 Yapım eklerinin işlevlerini ve kelimeye kazandırdığı anlam özelliklerini kavrar.',
                  '02.01.06 Birleşik kelimeyi kavrar.',
                  '02.01.07 Basit, türemiş ve birleşik kelimeleri ayırt eder.'
                ]
              },
              {
                konu: '04.01 Kelime Türleri Kavrama ve Uygulama',
                kazanimlar: [
                  '04.01.01  Hâl eklerinin işlevlerini kavrar.',
                  '04.01.02  İyelik eklerinin işlevlerini kavrar.',
                  '04.01.03 Zamirlerin cümledeki işlevlerini fark eder, zamirleri işlevlerine uygun olarak kullanır.',
                  '04.01.04 Sıfatların cümledeki işlevlerini fark eder, sıfatları işlevlerine uygun olarak kullanır.',
                  '04.01.05 Kelimeleri cümlede farklı görevlerde kullanır.',
                  '04.01.06 İsimlerin cümledeki işlevlerini kavrar, isimleri işlevlerine uygun olarak kullanır.',
                  '04.01.07 İsim tamlamalarının kuruluş ve anlam özelliklerini kavrar.',
                  '04.01.08 Sıfat tamlamalarının kuruluş ve anlam özelliklerini kavrar.',
                  '04.01.09 Edat, bağlaç, ünlemlerin işlevlerini ve cümleye kazandırdıkları anlam özelliklerini kavrar; bu kelimeleri işlevlerine uygun olarak kullanır.'
                ]
              },
              {
                konu: '06.02 Okuma/ Okuduğu metni anlama ve çözümleme',
                kazanimlar: [
                  '06.02.01 Metnin bağlamından hareketle kelime ve kelime gruplarının anlamlarını çıkarır.',
                  '06.02.02 Okuduklarındaki örtülü anlamları bulur.',
                  '06.02.03 Metindeki olay, yer, zaman, şahıs, varlık kadrosu ve bunlarla ilgili unsurları belirler.',
                  '06.02.04 Okuduğu metnin konusunu, ana fikrini/ana duygusunu belirler.',
                  '06.02.07 Metindeki ipuçlarından hareketle metnin başlangıcını, gelişimini ve sonucunu tahmin eder.',
                  '06.02.15 Metindeki anahtar kelimeleri belirler.',
                  '06.02.16 Metnin konusunu belirler.',
                  '06.02.17 Metindeki yardımcı fikirleri/duyguları belirler.',
                  '06.02.18 Anlatımın kimin ağzından yapıldığını belirler.',
                  '06.02.19 Metindeki sebep-sonuç ilişkilerini fark eder.',
                  '06.02.20 Metindeki amaç-sonuç ilişkilerini fark eder.',
                  '06.02.21 Kalıplaşmış cümle yapılarının kuruluş ve kullanım özelliklerini kavrar.',
                  '06.02.22 Okuduklarındaki öznel ve nesnel yargıları ayırt eder.',
                  '06.02.23 Metne ilişkin sorulara cevap verir.',
                  '06.02.24 Metnin türüyle ilgili özellikleri kavrar.',
                  '06.02.25 Metnin planını kavrar.',
                  '06.02.26 Metni oluşturan unsurlar arasındaki geçiş ve bağlantıları fark eder.',
                  '06.02.27 Metindeki söz sanatlarının anlatıma olan katkısını fark eder.',
                  '06.02.32 Metnin başlığı ile içeriği arasındaki ilişkiyi ortaya koyar.'
                ]
              }
            ]
          },
          {
            sinif: '07',
            konular: [
              {
                konu: '02.01 Dilbilgisi / Fiillerin yapı özellikleriyle ilgili bilgi ve kuralları kavrama ve uygulama',
                kazanimlar: [
                  '02.01.01 Basit, türemiş ve birleşik fiillerin kuruluş ve anlam özelliklerini kavrar.',
                  '02.01.02 Farklı yapı özelliklerinde fiilleri anlam özelliklerini dikkate alarak kullanır.'
                ]
              },
              {
                konu: '02.02 Dilbilgisi / Fiil kiplerinde zaman ve anlam kayması kavrama ve uygulama',
                kazanimlar: [
                  '02.02.01 Cümlede zaman kavramını belirleyen/destekleyen zarfları fark eder.',
                  '02.02.02 Fiil kiplerinde zaman ve anlam kaymasının nasıl gerçekleştiğini kavrar.',
                  '02.02.03 Fiil kiplerini farklı zaman ve anlamları ifade edecek şekilde kullanır.'
                ]
              },
              {
                konu: '02.03 Dilbilgisi / Ek fiille ilgili bilgi ve kuralları kavrama ve uygulama',
                kazanimlar: [
                  '02.03.01 İsim türünden kelimelerin kip ve kişi açısından biçimlenerek çekimlenebildiğini kavrar.',
                  '02.03.02 İsimlerin kip eki almasında ek fiilin rolünü kavrar.',
                  '02.03.03 İsimlerin ek fiil aracılığıyla hangi kiplerde çekimlenebildiğini kavrar.',
                  '02.03.04 Ek fiili işlevine uygun olarak kullanır.'
                ]
              },
              {
                konu: '02.04 Zaman ve kip çekimlerindeki birleşik yapıları kavrama ve uygulama',
                kazanimlar: [
                  '02.04.01 Zaman ve kip çekimlerindeki birleşik yapıların oluşumunda ek fiilin işlevini kavrar.',
                  '02.04.02 Zaman ve kip çekimlerindeki birleşik yapıların işlevlerini ve kullanım özelliklerini kavrar.',
                  '02.04.03 Zaman ve kip çekimlerindeki birleşik yapıları özelliklerine uygun biçimde kullanır.'
                ]
              },
              {
                konu: '04.01 Kelime Türleri Kavrama ve Uygulama',
                kazanimlar: [
                  '04.01.01Fiillerin anlam özelliklerini kavrar.',
                  '04.01.02 Kip ve çekimli fiili kavrar.',
                  '04.01.03 Bildirme kipleriyle dilek kiplerini ayırt eder.',
                  '04.01.04 Bildirme kiplerinin kullanım özelliklerini kavrar.',
                  '04.01.05 Dilek kiplerinin kullanım özelliklerini kavrar.',
                  '04.01.06 Fiillerin olumlu, olumsuz, soru ve olumsuz soru çekimleriyle ilgili uygulamalar yapar.',
                  '04.01.07 Zarfların cümledeki işlevlerini fark eder, zarfları işlevlerine uygun olarak kullanır.'
                ]
              },
              {
                konu: '05.02 Okuma / Okuduğu metni anlama ve çözümleme',
                kazanimlar: [
                  '05.02.01 Metnin bağlamından hareketle kelime ve kelime gruplarının anlamlarını çıkarır.',
                  '05.02.02 Metindeki anahtar kelimeleri belirler.',
                  '05.02.03 Metnin konusunu belirler.',
                  '05.02.04 Metnin ana fikrini/ana duygusunu belirler.',
                  '05.02.05 Metindeki yardımcı fikirleri/duyguları belirler.',
                  '05.02.06 Anlatımın kimin ağzından yapıldığını belirler.',
                  '05.02.07 Olay, yer, zaman, şahıs, varlık kadrosu ve bunlarla ilgili unsurları belirler.',
                  '05.02.08 Metindeki sebep-sonuç ilişkilerini fark eder.',
                  '05.02.09 Metindeki amaç-sonuç ilişkilerini fark eder.',
                  '05.02.10 Kalıplaşmış cümle yapılarının kuruluş ve kullanım özelliklerini kavrar.',
                  '05.02.11 Okuduklarındaki örtülü anlamları bulur.',
                  '05.02.12 Okuduklarındaki öznel ve nesnel yargıları ayırt eder.',
                  '05.02.15 Metne ilişkin sorulara cevap verir.',
                  '05.02.16 Metnin türüyle ilgili özellikleri kavrar.',
                  '05.02.17 Metnin planını kavrar.',
                  '05.02.18 Metni oluşturan unsurlar arasındaki geçiş ve bağlantıları fark eder',
                  '05.02.19 Metindeki söz sanatlarının anlama olan katkısını fark eder.',
                  '05.02.21 Metne ilişkin karşılaştırmalar yapar.'
                ]
              }
            ]
          },
          {
            sinif: '08',
            konular: [
              {
                konu: '02.01 Dilbilgisi / Fiilimsiler ile ilgili bilgi ve kuralları kavrama ve uygulama',
                kazanimlar: [
                  '02.01.01 Fiilimsiyle, fiil ve isim soylu kelimeler arasındaki farkları kavrar.',
                  '02.01.02 Fiilimsilerin işlevlerini ve kullanım özelliklerini kavrar.',
                  '02.01.03 Fiilimsileri özelliklerine uygun biçimde kullanır.',
                  '02.01.04 Cümlede, fiilimsiye bağlı kelime veya kelime gruplarını bulur.'
                ]
              },
              {
                konu: '02.02 Dilbilgisi / Cümleyle ilgili bilgi ve kuralları kavrama ve uygulama',
                kazanimlar: [
                  '02.02.01 Cümlenin temel ögelerini ve özelliklerini kavrar.',
                  '02.02.02 Cümlenin yardımcı ögelerini ve özelliklerini kavrar.',
                  '02.02.03 Cümlede vurgulanmak istenen ifadeyi belirler.',
                  '02.02.04 Cümledeki fiillerin çatı özelliklerini kavrar.',
                  '02.02.05 İsim ve fiil cümlelerini, anlam ve kullanım özelliklerine uygun biçimde kullanır.',
                  '02.02.06 Kurallı ve devrik cümleleri, anlam ve kullanım özelliklerine uygun biçimde kullanır.',
                  '02.02.07 Cümlelerin yapı özelliklerini kavrar.',
                  '02.02.08 Kalıplaşmış cümle yapılarının kuruluş ve kullanım özelliklerini kavrar.',
                  '02.02.09 Cümlenin ifade ettiği anlam özelliklerini kavrar.',
                  '02.02.10 Cümleler arasındaki anlam ilişkilerini kavrar.',
                  '02.02.11 Cümleye hâkim olan duyguyu fark eder.'
                ]
              },
              {
                konu: '04.02 Okuma / Okuduğu metni anlama ve çözümleme',
                kazanimlar: [
                  '04.02.01 Metnin bağlamından hareketle kelime ve kelime gruplarının anlamlarını çıkarır.',
                  '04.02.02 Metindeki anahtar kelimeleri belirler.',
                  '04.02.03 Metnin konusunu belirler.',
                  '04.02.04 Metnin ana fikrini/ana duygusunu belirler.',
                  '04.02.05 Metindeki yardımcı fikirleri/duyguları belirler.',
                  '04.02.06 Anlatımın kimin ağzından yapıldığını belirler.',
                  '04.02.07 Olay, yer, zaman, şahıs, varlık kadrosu ve bunlarla ilgili unsurları belirler.',
                  '04.02.08 Metindeki sebep-sonuç ilişkilerini fark eder.',
                  '04.02.09 Metindeki amaç-sonuç ilişkilerini fark eder.',
                  '04.02.10 Kalıplaşmış cümle yapılarının kuruluş ve kullanım özelliklerini kavrar.',
                  '04.02.11 Okuduklarındaki örtülü anlamları bulur.',
                  '04.02.12 Okuduklarındaki öznel ve nesnel yargıları ayırt eder.',
                  '04.02.16 Metnin türüyle ilgili özellikleri kavrar.',
                  '04.02.17 Metnin planını kavrar.',
                  '04.02.18 Metni oluşturan unsurlar arasındaki geçiş ve bağlantıları fark eder.',
                  '04.02.19 Metindeki söz sanatlarının anlatıma olan katkısını fark eder.'
                ]
              }
            ]
          }
        ]
      },
      {
        ders: 'İngilizce',
        isim: 'Su',
        slug: 'su',
        muhurler: [
          {isim: 'Arga', slugYeni: 'arga', seviye: 'gumus', slug: 'ahtapot'},
          {isim: 'Kövez', slugYeni: 'kovez', seviye: 'gumus', slug: 'denizati'},
          {isim: 'Kaygun', slugYeni: 'kaygun', seviye: 'gumus', slug: 'istakoz'},
          {isim: 'Batrak', slugYeni: 'batrak', seviye: 'gumus', slug: 'kilicbaligi'},
          {isim: 'Alcu', slugYeni: 'alcu', seviye: 'gumus', slug: 'kopekbaligi'},
          {isim: 'İde', slugYeni: 'ide', seviye: 'gumus', slug: 'mors'},
          {isim: 'Monguç', slugYeni: 'monguc', seviye: 'gumus', slug: 'pirana'},
          {isim: 'Çıldım', slugYeni: 'cildim', seviye: 'gumus', slug: 'vatoz'},
          {isim: 'Tedan', slugYeni: 'tedan', seviye: 'gumus', slug: 'yengec'},
          {isim: 'Ağalbay', slugYeni: 'agalbay', seviye: 'gumus', slug: 'yunus'},
          {isim: 'Elik', slugYeni: 'elik', seviye: 'altin', slug: 'ahtapot'},
          {isim: 'Abız', slugYeni: 'abiz', seviye: 'altin', slug: 'denizati'},
          {isim: 'Ceben', slugYeni: 'ceben', seviye: 'altin', slug: 'istakoz'},
          {isim: 'Kıluç', slugYeni: 'kiluc', seviye: 'altin', slug: 'kilicbaligi'},
          {isim: 'Kaşgar', slugYeni: 'kasgar', seviye: 'altin', slug: 'kopekbaligi'},
          {isim: 'Balaman', slugYeni: 'balaman', seviye: 'altin', slug: 'mors'},
          {isim: 'Acar', slugYeni: 'acar', seviye: 'altin', slug: 'pirana'},
          {isim: 'Yakak', slugYeni: 'yakak', seviye: 'altin', slug: 'vatoz'},
          {isim: 'Bıçgın', slugYeni: 'bicgin', seviye: 'altin', slug: 'yengec'},
          {isim: 'Kilüken', slugYeni: 'kiluken', seviye: 'altin', slug: 'yunus'}
        ],
        mufredat: [
          {
            sinif: '05',
            konular: [
              {
                konu: 'Grammar (A1)',
                kazanimlar: [
                  'Present Simple',
                  'Pronouns',
                  'Articles',
                  'Prepositions of place and time',
                  'Conjunctions / linkers: and / but / because / or',
                  'Irregular plurals',
                  'Possessive',
                  'Adjectives',
                  'Too/ very',
                  'Can (ability / possibility)',
                  'Short form answers',
                  'Going to (future plans)',
                  'Will (offers)',
                  'Adverbs of Frequency',
                  'Imperatives',
                  'Past Simple',
                  'Present Continuous',
                  'Comparatives',
                  'Superlatives',
                  'Irregular Adverbs'
                ]
              },
              {
                konu: 'Grammar (A1+)',
                kazanimlar: [
                  'Present Simple',
                  'Articles',
                  'Pronouns',
                  'Countable / uncountable nouns',
                  'Adverbs of frequency and manner',
                  'Too/ not enough',
                  'Can / could for requests',
                  'Adjectives and modifiers',
                  'Past Simple',
                  'Present Continuous for things happening now and future',
                  'Comparative and superlative',
                  'Present Perfect and participles',
                  'Imperatives',
                  'Should for advice',
                  'Have to / need to for obligation',
                  'Be like for descriptions',
                  'Present Simple for future facts',
                  'Future Simple for future facts'
                ]
              },
              {
                konu: 'Vocabulary and Topical (A1)',
                kazanimlar: [
                  'Numbers (cardinal / ordinal) and money',
                  'Countries, nationalities and languages',
                  'Times',
                  'Days, dates, months, years and seasons',
                  'Shops and places',
                  'Interests, sports and activities',
                  'Jobs',
                  'Rooms and furniture',
                  'Colours',
                  'Size and weight',
                  'Body parts and appearance',
                  'Food, meals, cooking',
                  'Weather',
                  'Transport',
                  'Health',
                  'Feelings and emotions',
                  'Street directions',
                  'ClothesGreeting and Introducing'
                ]
              },
              {
                konu: 'Vocabulary and Topical (A1+)',
                kazanimlar: [
                  'Families',
                  'Food and meals',
                  'Clothing and shopping',
                  'Prices',
                  'Daily routines',
                  'Personality',
                  'Appearance',
                  'Present and childhood abilities',
                  'Basic suffixes',
                  'Work and jobs',
                  'Transport',
                  'Travel',
                  'Machines and inventions',
                  'Festivals and celebrations',
                  'Hotel situations',
                  'Weather and climate'
                ]
              },
              {
                konu: 'Functional (A1)',
                kazanimlar: [
                  'Buying and asking prices',
                  'Asking about personal information',
                  'Describing people and objects',
                  'Telling the time',
                  'Talking about routines',
                  'Talking about frequency and time duration',
                  'Talking about likes and dislikes',
                  'Giving opinions',
                  'Talking about past experiences',
                  'Inviting/ refusing/accepting/ thanking',
                  'Requesting/ offering',
                  'Asking permission',
                  'Giving instructions',
                  'Making suggestions',
                  'Talking about future arrangements',
                  'Applying for a job'
                ]
              },
              {
                konu: 'Functional (A1+)',
                kazanimlar: [
                  'Giving / justifying opinions',
                  'Talking about routines and habits',
                  'Talking about intentions',
                  'Describing experiences',
                  'Talking about feelings',
                  'Making comparisons',
                  'Inviting',
                  'Making decisions',
                  'Describing and buying things',
                  'Talking about possibility',
                  'Expressing hopes',
                  'Talking about rules and obligations',
                  'Giving instructions',
                  'Making offers',
                  'Advising and suggesting',
                  'Apologising',
                  'Congratulating'
                ]
              }
            ]
          },
          {
            sinif: '06',
            konular: [
              {
                konu: 'Grammar (A2)',
                kazanimlar: [
                  'Present Simple',
                  'Present Continuous',
                  'Comparative and superlative',
                  'Past Simple',
                  'Past Simple Continuous',
                  'Present Perfect',
                  'Going to and will for predictions and future events',
                  'Adverbs of frequency and manner',
                  'Reflexive pronouns',
                  'So/ such',
                  'Have to/ need to for obligation',
                  'Present Simple Passive',
                  'When / while',
                  'Must / might for deductions',
                  'As soon as',
                  'Be able to / good at',
                  'Although / however',
                  'First Conditional'
                ]
              },
              {
                konu: 'Grammar (B1)',
                kazanimlar: [
                  'Used to + infinitive',
                  'Past Simple and Present Perfect',
                  'Neither / so do I',
                  'Modal verbs',
                  'Reported speech',
                  'First, second conditional',
                  'Adverbs of manner and modifiers',
                  'Relative clauses',
                  'Adjectives and their connotations',
                  'Present Perfect Continuous',
                  'Look + adjective, look like + noun',
                  'Be able to/ can/ manage to',
                  'Passives',
                  'Past Perfect Simple',
                  'Have and have got',
                  'Be allowed to and be supposed to',
                  'A / few and a / little',
                  'Although / in spite of / despite',
                  'Question tags'
                ]
              },
              {
                konu: 'Vocabulary and Topical (A2)',
                kazanimlar: [
                  'Families',
                  'Restaurants and leisure venues',
                  'Personality',
                  'Biographical information',
                  'Buildings and monuments',
                  'Weather',
                  'Clothes and accessories',
                  'Large numbers',
                  'Travel and tourism',
                  'Work and careers',
                  'Hobbies, sports and interests',
                  'Education',
                  'Life changes and events',
                  'Political systems and change',
                  'Animals',
                  'Descriptions of people, health, fitness and illnesses',
                  'Types of music and concerts',
                  'Household equipment'
                ]
              },
              {
                konu: 'Vocabulary and Topical (B1)',
                kazanimlar: [
                  'Education',
                  'Appearances',
                  'Clothes',
                  'Character',
                  'Make and do',
                  'Housework',
                  'Holidays and travel brochures',
                  'Illness',
                  'Cooking',
                  'Weather',
                  'Furniture and appliances',
                  'Types of books, films, and TV programmes',
                  'Crime and punishment',
                  'Political systems',
                  'Family relationships',
                  'Pets and animals',
                  'Consumer services',
                  'Hotel facilities',
                  'Affixes',
                  'Participles'
                ]
              },
              {
                konu: 'Functional (A2)',
                kazanimlar: [
                  'Asking personal questions',
                  'Talking about personal experiences',
                  'Asking directions',
                  'Describing personality',
                  'Making travel arrangements',
                  'Ordering in a restaurant',
                  'Talking about preferences',
                  'Expressing preferences',
                  'Making deductions',
                  'Making predictions',
                  'Offering and suggesting',
                  'Talking about obligation',
                  'Requesting'
                ]
              },
              {
                konu: 'Functional (B1)',
                kazanimlar: [
                  'Describing location, people and things',
                  'Stating preferences and opinions',
                  'Talking about obligation',
                  'Reporting requests and orders',
                  'Advising',
                  'Making deductions',
                  'Guessing',
                  'Talking about possibility / probability and certainty',
                  'Refusing',
                  'Describing faulty goods'
                ]
              }
            ]
          },
          {
            sinif: '07',
            konular: [
              {
                konu: 'Grammar (B1)',
                kazanimlar: [
                  'Used to + infinitive',
                  'Past Simple and Present Perfect',
                  'Neither / so do I',
                  'Modal verbs',
                  'Reported speech',
                  'First, second conditional',
                  'Adverbs of manner and modifiers',
                  'Relative clauses',
                  'Adjectives and their connotations',
                  'Present Perfect Continuous',
                  'Look + adjective, look like + noun',
                  'Be able to/ can/ manage to',
                  'Passives',
                  'Past Perfect Simple',
                  'Have and have got',
                  'Be allowed to and be supposed to',
                  'A / few and a / little',
                  'Although / in spite of / despite',
                  'Question tags'
                ]
              },
              {
                konu: 'Grammar (B2)',
                kazanimlar: [
                  'Habit in the Present and the Past',
                  'Present Perfect Simple and Present Perfect Continuous',
                  'Past Simple and Past Continuous and Past Perfect',
                  'Question tags',
                  'Will. Going to, Present Simple, Present Continuous for the future',
                  'Future Perfect',
                  'Phrasal verbs',
                  'Zero, first, second and third conditionals',
                  'Wish and if only',
                  'Passive',
                  'Compounds of some, any, no, every.',
                  'Reported speech',
                  'Relative clauses',
                  'Conjunctions: although, despite, in spite of , otherwise, unless',
                  'Modals: present and perfect',
                  'Always for frequency /+ present continuous'
                ]
              },
              {
                konu: 'Vocabulary and Topical (B1)',
                kazanimlar: [
                  'Education',
                  'Appearances',
                  'Clothes',
                  'Character',
                  'Make and do',
                  'Housework',
                  'Holidays and travel brochures',
                  'Illness',
                  'Cooking',
                  'Weather',
                  'Furniture and appliances',
                  'Types of books, films, and TV programmes',
                  'Crime and punishment',
                  'Political systems',
                  'Family relationships',
                  'Pets and animals',
                  'Consumer services',
                  'Hotel facilities',
                  'Affixes',
                  'Participles'
                ]
              },
              {
                konu: 'Vocabulary and Topical (B2)',
                kazanimlar: [
                  'Affixes',
                  'Collocations',
                  'Work, working conditions',
                  'Approximations with -ish',
                  'Transport and exploration',
                  'Phrasal verbs',
                  'Crime and punishment',
                  'Relationships',
                  'Festivals and celebrations',
                  'Connotation',
                  'Homonyms',
                  'Idiomatic expressions',
                  'Sport and leisure',
                  'Euphemisms',
                  'Adverbs of manner and modifiers',
                  'Geography and climate',
                  'Participle adjectives',
                  'Banks / money',
                  'Colloquial expressions and slang'
                ]
              },
              {
                konu: 'Functional (B1)',
                kazanimlar: [
                  'Describing location, people and things',
                  'Stating preferences and opinions',
                  'Talking about obligation',
                  'Reporting requests and orders',
                  'Advising',
                  'Making deductions',
                  'Guessing',
                  'Talking about possibility / probability and certainty',
                  'Refusing',
                  'Describing faulty goods'
                ]
              },
              {
                konu: 'Functional (B2)',
                kazanimlar: [
                  'Giving opinions',
                  'Summarising',
                  'Expressing regret',
                  'Drawing conclusions',
                  'Making offers',
                  'Describing cause and effect',
                  'Stating purpose',
                  'Emphasising',
                  'Stating contrast',
                  'Adding information',
                  'Congratulating',
                  'Commiserating',
                  'Clarifying',
                  'Guessing',
                  'Order arguments',
                  'Giving examples'
                ]
              }
            ]
          },
          {
            sinif: '08',
            konular: [
              {
                konu: 'Grammar (B1)',
                kazanimlar: [
                  'Used to + infinitive',
                  'Past Simple and Present Perfect',
                  'Neither / so do I',
                  'Modal verbs',
                  'Reported speech',
                  'First, second conditional',
                  'Adverbs of manner and modifiers',
                  'Relative clauses',
                  'Adjectives and their connotations',
                  'Present Perfect Continuous',
                  'Look + adjective, look like + noun',
                  'Be able to/ can/ manage to',
                  'Passives',
                  'Past Perfect Simple',
                  'Have and have got',
                  'Be allowed to and be supposed to',
                  'A / few and a / little',
                  'Although / in spite of / despite',
                  'Question tags'
                ]
              },
              {
                konu: 'Grammar (B2)',
                kazanimlar: [
                  'Habit in the Present and the Past',
                  'Present Perfect Simple and Present Perfect Continuous',
                  'Past Simple and Past Continuous and Past Perfect',
                  'Question tags',
                  'Will. Going to, Present Simple, Present Continuous for the future',
                  'Future Perfect',
                  'Phrasal verbs',
                  'Zero, first, second and third conditionals',
                  'Wish and if only',
                  'Passive',
                  'Compounds of some, any, no, every.',
                  'Reported speech',
                  'Relative clauses',
                  'Conjunctions: although, despite, in spite of , otherwise, unless',
                  'Modals: present and perfect',
                  'Always for frequency /+ present continuous'
                ]
              },
              {
                konu: 'Vocabulary and Topical (B1)',
                kazanimlar: [
                  'Education',
                  'Appearances',
                  'Clothes',
                  'Character',
                  'Make and do',
                  'Housework',
                  'Holidays and travel brochures',
                  'Illness',
                  'Cooking',
                  'Weather',
                  'Furniture and appliances',
                  'Types of books, films, and TV programmes',
                  'Crime and punishment',
                  'Political systems',
                  'Family relationships',
                  'Pets and animals',
                  'Consumer services',
                  'Hotel facilities',
                  'Affixes',
                  'Participles'
                ]
              },
              {
                konu: 'Vocabulary and Topical (B2)',
                kazanimlar: [
                  'Affixes',
                  'Collocations',
                  'Work, working conditions',
                  'Approximations with -ish',
                  'Transport and exploration',
                  'Phrasal verbs',
                  'Crime and punishment',
                  'Relationships',
                  'Festivals and celebrations',
                  'Connotation',
                  'Homonyms',
                  'Idiomatic expressions',
                  'Sport and leisure',
                  'Euphemisms',
                  'Adverbs of manner and modifiers',
                  'Geography and climate',
                  'Participle adjectives',
                  'Banks / money',
                  'Colloquial expressions and slang'
                ]
              },
              {
                konu: 'Functional (B1)',
                kazanimlar: [
                  'Describing location, people and things',
                  'Stating preferences and opinions',
                  'Talking about obligation',
                  'Reporting requests and orders',
                  'Advising',
                  'Making deductions',
                  'Guessing',
                  'Talking about possibility / probability and certainty',
                  'Refusing',
                  'Describing faulty goods'
                ]
              },
              {
                konu: 'Functional (B2)',
                kazanimlar: [
                  'Giving opinions',
                  'Summarising',
                  'Expressing regret',
                  'Drawing conclusions',
                  'Making offers',
                  'Describing cause and effect',
                  'Stating purpose',
                  'Emphasising',
                  'Stating contrast',
                  'Adding information',
                  'Congratulating',
                  'Commiserating',
                  'Clarifying',
                  'Guessing',
                  'Order arguments',
                  'Giving examples'
                ]
              }
            ]
          }
        ]
      },
      {
        ders: 'Sosyal Bilgiler',
        isim: 'Toprak',
        slug: 'toprak',
        muhurler: [
          {isim: 'Tatıg', slugYeni: 'tatig', seviye: 'gumus', slug: 'armut'},
          {isim: 'Kete', slugYeni: 'kete', seviye: 'gumus', slug: 'cam'},
          {isim: 'Almıla', slugYeni: 'almila', seviye: 'gumus', slug: 'elma'},
          {isim: 'Alança', slugYeni: 'alanca', seviye: 'gumus', slug: 'gurgen'},
          {isim: 'Kıncal', slugYeni: 'kincal', seviye: 'gumus', slug: 'kavak'},
          {isim: 'Köptük', slugYeni: 'koptuk', seviye: 'gumus', slug: 'kiraz'},
          {isim: 'Kozan', slugYeni: 'kozan', seviye: 'gumus', slug: 'kozalak'},
          {isim: 'Çından', slugYeni: 'cindan', seviye: 'gumus', slug: 'mese'},
          {isim: 'Kamalag', slugYeni: 'kamalag', seviye: 'gumus', slug: 'sedir'},
          {isim: 'Ağaça', slugYeni: 'agaca', seviye: 'gumus', slug: 'sogut'},
          {isim: 'Armut', slugYeni: 'armut', seviye: 'altin', slug: 'armut'},
          {isim: 'Arca', slugYeni: 'arca', seviye: 'altin', slug: 'cam'},
          {isim: 'Alma', slugYeni: 'alma', seviye: 'altin', slug: 'elma'},
          {isim: 'Mungul', slugYeni: 'mungul', seviye: 'altin', slug: 'gurgen'},
          {isim: 'İlgüy', slugYeni: 'ilguy', seviye: 'altin', slug: 'kavak'},
          {isim: 'Akçora', slugYeni: 'akcora', seviye: 'altin', slug: 'kiraz'},
          {isim: 'Torçuk', slugYeni: 'torcuk', seviye: 'altin', slug: 'kozalak'},
          {isim: 'Elçim', slugYeni: 'elcim', seviye: 'altin', slug: 'mese'},
          {isim: 'Cide', slugYeni: 'cide', seviye: 'altin', slug: 'sedir'},
          {isim: 'Köngül', slugYeni: 'kongul', seviye: 'altin', slug: 'sogut'}
        ],
        mufredat: [
          {
            sinif: '05',
            konular: [
              {
                konu: 'SB.01 Haklarımı Öğreniyorum',
                kazanimlar: [
                  'SB.01.01 Bulunduğu çeşitli grup ve kurumlar içinde yerini belirler.',
                  'SB.01.02 İçinde bulunduğu gruplar ile gruplara ait rolleri ilişkilendirir.',
                  'SB.01.03 Katıldığı gruplarda aldığı roller ile rollerin gerektirdiği hak ve sorumlulukları ilişkilendirir.',
                  'SB.01.04 Çocuk olarak haklarını fark eder.'
                ]
              },
              {
                konu: 'SB.02 Adım Adım Türkiye',
                kazanimlar: [
                  'SB.02.01 Çevresindeki ve ülkemizin çeşitli yerlerindeki doğal varlıklar ile tarihî mekânları, nesneleri ve yapıtları tanır.',
                  'SB.02.02 Ülkemizin çeşitli yerlerindeki kültürel özelliklere örnekler verir.',
                  'SB.02.03 Ülkemizin çeşitli yerleri ile kendi çevresinin kültürel özelliklerini benzerlikler ve farklılıklar açısından karşılaştırır.',
                  'SB.02.04 Kültürel ögelerin, insanların bir arada yaşamasındaki önemini açıklar.',
                  'SB.02.05 Kanıt kullanarak Atatürk inkılâplarının öncesi ile sonrasındaki günlük yaşamı karşılaştırır.',
                  'SB.02.06 Atatürk inkılâplarıyla ilkelerini ilişkilendirir.'
                ]
              },
              {
                konu: 'SB.03 Bölgemizi Tanıyalım',
                kazanimlar: [
                  'SB.03.01 Türkiye\'nin kabartma haritası üzerinde yaşadığı bölgenin yüzey şekillerini genel olarak tanır.',
                  'SB.03.02 Yaşadığı bölgede görülen iklimin, insan faaliyetlerine etkisini, günlük yaşantısından örnekler vererek açıklar.',
                  'SB.03.03 Yaşadığı bölgedeki insanların yoğun olarak yaşadıkları yerlerle coğrafi özellikleri ilişkilendirir.',
                  'SB.03.04 Yaşadığı bölgedeki insanların doğal ortamı değiştirme ve ondan yararlanma şekillerine kanıtlar gösterir.',
                  'SB.03.05 Yaşadığı bölgede görülen bir afet ile bölgenin coğrafi özelliklerini ilişkilendirir.',
                  'SB.03.06 Kültürümüzün sözlü ve yazılı ögelerinden yola çıkarak, doğal afetlerin toplum hayatı üzerine etkilerini örneklendirir.',
                  'SB.03.07 Yaşadığı bölgede görülen doğal afetlere neden olan uygulamaları fark eder.'
                ]
              },
              {
                konu: 'SB.04 Ürettiklerimiz',
                kazanimlar: [
                  'SB.04.01 Yaşadığı bölgedeki ekonomik faaliyetleri fark eder.',
                  'SB.04.02 Yaşadığı bölgedeki ekonomik faaliyetler ile coğrafî özellikleri ilişkilendirir.',
                  'SB.04.03 Yaşadığı bölgedeki ekonomik faaliyetlere ilişkin meslekleri belirler.',
                  'SB.04.04 Yaşadığı bölgedeki ekonomik faaliyetlerin ülke ekonomisindeki yerini değerlendirir.',
                  'SB.04.05 Ekonomideki insan etkisini fark eder.',
                  'SB.04.06 Üretime katkıda bulunma konusunda görüş oluşturur.',
                  'SB.04.07 İş birliği yaparak üretime dayalı, yeni fikirler geliştirir.'
                ]
              },
              {
                konu: 'SB.05 Gerçekleşen Düşler',
                kazanimlar: [
                  'SB.05.01 Buluşlarla teknolojik gelişmeleri ilişkilendirir.',
                  'SB.05.02 Buluşların ve teknolojik ürünlerin toplum hayatımıza etkilerini tartışır.',
                  'SB.05.03 Buluş yapanların ve bilim insanlarının ortak özelliklerinin farkına varır.',
                  'SB.05.04 Kanıtlara dayanarak, Atatürk\'ün bilim ve teknolojiye verdiği önemi gösterir.',
                  'SB.05.05 Bilim ve teknoloji ile ilgili, düzeyine uygun süreli yayınları tanır ve izler.',
                  'SB.05.06 Yaptığı çalışmalarda yararlandığı kaynakları gösterir'
                ]
              },
              {
                konu: 'SB.06 Toplum İçin Çalışanlar',
                kazanimlar: [
                  'SB.06.01 Toplumun temel ihtiyaçlarıyla bu ihtiyaçlara hizmet eden kurumları ilişkilendirir.',
                  'SB.06.02 Kurumların insan yaşamındaki yeri konusunda görüş oluşturur.',
                  'SB.06.03 Sivil toplum kuruluşlarını etkinlik alanlarına göre sınıflandırır.',
                  'SB.06.04 Sivil toplum kuruluşlarının etkinliklerinin sonuçlarını değerlendirir.',
                  'SB.06.05 Bireylerin rolleri açısından sivil toplum kuruluşlarını resmî kurum ve kuruluşlarla karşılaştırır.'
                ]
              },
              {
                konu: 'SB.07 Bir Ülke, Bir Bayrak',
                kazanimlar: [
                  'SB.07.01 Toplumsal yaşamı düzenleyen yasaların varlığını ve önemini fark eder.',
                  'SB.07.02 Yaşadığı yerdeki merkeze bağlı yönetim birimleri ile bu birimlerin temel görevlerini ilişkilendirir.',
                  'SB.07.03 Merkezî yönetim birimlerini tanıyarak bu birimleri temel görevleriyle ilişkilendirir.',
                  'SB.07.04 Demokratik yönetim birimlerindeki yetki ile ulusal egemenlik arasındaki ilişkiyi açıklar.',
                  'SB.07.05 Ulusal Egemenlik ve bağımsızlık sembollerine değer verir.'
                ]
              },
              {
                konu: 'SB.08 Hepimizin Dünyası',
                kazanimlar: [
                  'SB.08.01 Dünya çocuklarının ortak yönlerini ve ilgi alanlarını fark eder.',
                  'SB.08.02 Ülkeler arasında ekonomik alışveriş olduğunu fark eder.',
                  'SB.08.03 Ülkeler arasındaki ekonomik ilişkilerde iletişim ve ulaşım teknolojisinin etkisini tartışır.',
                  'SB.08.04 Çeşitli ülkelerde bulunan ortak miras ögelerine örnekler verir.',
                  'SB.08.05 Ortak mirasın tanınmasında turizmin yerini fark eder.',
                  'SB.08.06 Turizmin uluslararası ilişkilerdeki yeri konusunda bakış açısı geliştirir.'
                ]
              }
            ]
          },
          {
            sinif: '06',
            konular: [
              {
                konu: 'SB.01 Birey ve Toplum / Sosyal Bilgiler Öğreniyorum',
                kazanimlar: [
                  'SB.01.01.01 Yakın çevresindeki bir örnekten yola çıkarak bir olayın çok boyutluluğunu fark eder.',
                  'SB.01.01.02 Olgu ve görüşü ayırt eder.',
                  'SB.01.01.03 Bilimsel araştırma basamaklarını kullanarak araştırma yapar.',
                  'SB.01.01.04 Bir soruna getirilen çözümlerin hak, sorumluluk ve özgürlükler temelinde olması gerektiğini savunur.',
                  'SB.01.01.05 Sosyal bilgilerin, Türkiye Cumhuriyeti\'nin etkin bir vatandaşı olarak gelişimine katkısını fark eder.',
                  'SB.01.01.06 Atatürk\'ün ülkemizde sosyal bilimlerin geliştirilmesi için yaptığı uygulamalara örnekler verir.'
                ]
              },
              {
                konu: 'SB.02 İnsanlar, Yerler ve Çevreler / Yeryüzünde Yaşam',
                kazanimlar: [
                  'SB.02.01.01 Farklı ölçeklerde çizilmiş haritalar üzerinde konum ile ilgili kavramları kullanarak kıtaların, okyanusların ve ülkemizin coğrafi konumunu tanımlar.',
                  'SB.02.01.02 Dünyanın farklı doğal ortamlarındaki insan yaşantılarından yola çıkarak, iklim özellikleri hakkında çıkarımlarda bulunur.',
                  'SB.02.01.03 Haritalardan ve görsel materyallerden yararlanarak Türkiye\'de görülen iklim türlerinin dağılışında, konumun ve yeryüzü şekillerinin rolünü açıklar.',
                  'SB.02.01.04 Örnek incelemeler yoluyla tarih öncesindeki ilk yerleşmelerden günümüze, yerleşmeyi etkileyen faktörler hakkında çıkarımlarda bulunur.',
                  'SB.02.01.05 Farklı ölçeklerde çizilmiş haritalardan yararlanarak ölçek değiştiğinde haritanın değişen özellikleri hakkında çıkarımlarda bulunur.',
                  'SB.02.01.06 Konum ile ilgili kavramları kullanarak kıtaların, okyanusların ve ülkemizin coğrafi konumunu tanımlar.',
                  'SB.02.01.07 Haritalardan ve görsel materyallerden yararlanarak Türkiye\'de görülen iklim türlerinin özellikleri hakkında çıkarımlarda bulunur.',
                  'SB.02.01.08 Anadolu ve Mezopotamya\'da yaşamış ilk uygarlıkların yerleşme ve ekonomik faaliyetleri ile sosyal yapıları arasındaki etkileşimi fark eder.',
                  'SB.02.02.01 Paralel ve meridyenlerin özelliklerini kavrar.',
                  'SB.02.02.02 Matematiksel verilerden faydalanarak harita ile ilgili hesaplamaları kavrar.',
                  'SB.02.02.03 İklimi etkileyen faktörleri kavrar.',
                  'SB.02.02.04 Tarih Öncesi ve Tarihi Devirleri Özellikleri ile ayırt eder.'
                ]
              },
              {
                konu: 'SB.03 Kültür ve Miras / İpek Yolunda Türkler',
                kazanimlar: [
                  'SB.03.01.01 Destan, yazıt ve diğer belgelerden yararlanarak, Orta Asya ilk Türk toplumlarının siyasal, ekonomik ve kültürel özelliklerine ilişkin çıkarımlarda bulunur.',
                  'SB.03.01.02 Orta Asya ilk Türk toplumlarının kültürel özellikleriyle yaşadıkları yerlerin coğrafî özelliklerini ilişkilendirir.',
                  'SB.03.01.03 Günümüz Türk Silahlı Kuvvetleri\'ni ilk Türk devletlerinin ordusu ile ilişkilendirerek, Türk Silahlı Kuvvetleri\'nin önemini ve görevlerini kavrar.',
                  'SB.03.01.04 İpek Yolu\'nun toplumlar arası siyasal, kültürel ve ekonomik ilişkilerdeki rolünü fark eder.',
                  'SB.03.01.05 Dönemin devlet adamları ve Türk büyüklerinin hayatından yararlanarak ilk Türk- İslam devletlerinin siyasal, sosyal ve kültürel özelliklerine ilişkin çıkarımlarda bulunur.',
                  'SB.03.01.06 Örnek incelemeler yoluyla kutlama ve törenlerimizdeki uygulamaların kültürümüzü oluşturan unsurlarla ilişkisini değişim ve süreklilik açısından değerlendirir.',
                  'SB.03.01.07 Orta Asya ilk Türk devletleri ve Türk-İslam devletlerinin Türk kültür, sanat ve estetik anlayışına katkılarına kanıtlar gösterir.',
                  'SB.03.01.08 Görsel ve yazılı materyallerden yararlanarak İslamiyet\'in ortaya çıkışı ve yayılışını inceler.',
                  'SB.03.01.09 Türklerin İslamiyet\'i kabulleri ile birlikte siyasî, sosyal ve kültürel alanlarda meydana gelen değişimleri fark eder.',
                  'SB.03.02.01 İslamiyet\'in doğuşu,Hz.Muhammed ve Dört halife devri ile sonrası olaylarını analiz eder.'
                ]
              },
              {
                konu: 'SB.04 Üretim, Dağıtım ve Tüketim / Ülkemizin Kaynakları',
                kazanimlar: [
                  'SB.04.01.01 Ülkemizin kaynaklarıyla ekonomik faaliyetlerini ilişkilendirerek bunların ülke ekonomisindeki yerini ve önemini değerlendirir.',
                  'SB.04.01.02 Türkiye\'nin coğrafî özelliklerini dikkate alarak, yatırım ve pazarlama proje önerleri tasarlar.',
                  'SB.04.01.03 Vatandaşlık sorumluluğu ve ülke ekonomisine katkısı açısından vergi vermenin gereğini ve önemini savunur.',
                  'SB.04.01.04 Doğal kaynakların bilinçsizce tüketilmesinin insan yaşamına etkilerini tartışır.',
                  'SB.04.01.05 Nitelikli insan gücünün Türkiye ekonomisinin gelişmesindeki rolünü değerlendirir.',
                  'SB.04.01.06 İlgi duyduğu mesleklerin gerektirdiği eğitim, beceri ve kişilik özelliklerini araştırır.',
                  'SB.04.02.01 Ülkemizde yetişen ürünlerin özelliklerini ve yetişme koşullarını ayırt eder.',
                  'SB.04.03.01 Ülkemizde çıkartılan madenler ve enerji kaynaklarını çıkarıldıkları yerlerle birlikte ayırt eder.',
                  'SB.04.04.01 Gap\'ın önemini kavrar.'
                ]
              },
              {
                konu: 'SB.05 Küresel Bağlantılar / Ülkemiz ve Dünya',
                kazanimlar: [
                  'SB.05.01.01 Görsel materyalleri ve verileri kullanarak dünyada nüfus ve ekonomik faaliyetlerin dağılışının nedenleri hakkında çıkarımlarda bulunur.',
                  'SB.05.01.02 Ülkemizin diğer ülkelerle olan ekonomik ilişkilerini, kaynaklar ve ihtiyaçlar açısından değerlendirir.',
                  'SB.05.01.03 Türk Cumhuriyetleri, komşu ve diğer ülkelerle olan kültürel, sosyal, siyasi ve ekonomik ilişkilerimizi Atatürk\'ün milli dış politika anlayışı açısından değerlendirir.',
                  'SB.05.01.04 Ülkemizin diğer ülkelerle doğal afetlerde ve çevre sorunlarında dayanışma ve işbirliği içinde olmasının önemini fark eder.',
                  'SB.05.01.05 Uluslararası kültür, sanat, fuar ve spor etkinliklerinin toplumlar arası etkileşimdeki rolünü değerlendirir.'
                ]
              },
              {
                konu: 'SB.06 Güç, Yönetim ve Toplum / Demokrasinin Serüveni',
                kazanimlar: [
                  'SB.06.01.01 Demokrasinin temel ilkeleri açısından farklı yönetim biçimlerini karşılaştırır.',
                  'SB.06.01.02 Değişik dönem ve kültürlerde demokratik yönetim anlayışının tarihsel gelişimini tartışır.',
                  'SB.06.01.03 Demokratik yönetimlerde yaşama hakkı, kişi dokunulmazlığı hakkı, din ve vicdan özgürlüğü ile düşünce özgürlüğüne sahip olunması gerektiğini savunur.',
                  'SB.06.01.04 Tarihsel belgelerden yola çıkarak insan haklarının gelişim sürecini analiz eder.',
                  'SB.06.01.05 Türk tarihinde kadının konumu ile ilgili örnekleri, kadın haklarının gelişimi açısından yorumlar.'
                ]
              },
              {
                konu: 'SB.07 Bilim, Teknoloji ve Toplum / Elektronik Yüzyıl',
                kazanimlar: [
                  'SB.07.01.01 Sosyal bilimlerdeki çalışma ve bulgulardan hareketle sosyal bilimlerin toplum hayatına etkisine örnekler verir.',
                  'SB.07.01.02 Bilimsel ve teknolojik gelişmelerin gelecekteki yaşam üzerine etkilerine ilişkin yaratıcı fikirler ileri sürer.',
                  'SB.07.01.03 Tıp alanındaki buluş ve gelişmelerle insan hayatı ve toplumsal dayanışma arasındaki ilişkiyi fark eder.',
                  'SB.07.01.04 Telif ve patent hakları saklı ürünlerin yasal yollardan temin edilmesinin gerekliliğini savunur.',
                  'SB.07.01.05 Uygulama ve eserlerinden yola çıkarak Atatürk\'ün akılcılığa ve bilime verdiği önemi fark eder.',
                  'SB.07.02.01 Dünyadaki bulaşıcı hastalıklar ve korunma yollarını fark eder.'
                ]
              }
            ]
          },
          {
            sinif: '07',
            konular: [
              {
                konu: '01.01 Birey ve Toplum / İletişim ve İnsan İlişkileri',
                kazanimlar: [
                  '01.01.01 İletişimi, olumlu olumsuz etkileyen tutum ve davranışları fark ederek kendi tutum ve davranışlarıyla karşılaştırır.',
                  '01.01.02 İnsanlar arasında kurulan olumlu ilişkilerde iletişimin önemini fark eder.',
                  '01.01.03 İnsanlar arası etkileşimde kitle iletişim araçlarının rolünü tartışır.',
                  '01.01.04 Doğru bilgi alma hakkı, düşünceyi açıklama özgürlüğü ve kitle iletişim özgürlüğü arasındaki bağlantıyı fark eder.',
                  '01.01.05 Kitle iletişim özgürlüğü ve özel hayatın gizliliği kavramlarını, birbiriyle ilişkileri çerçevesinde yorumlar.',
                  '01.01.06 Atatürk\'ün iletişime verdiği öneme kanıtlar gösterir.'
                ]
              },
              {
                konu: '02.01 İnsanlar, Yerler ve Çevreler / Ülkemizde Nüfus',
                kazanimlar: [
                  '02.01.01 Görsel materyaller ve verilerden yararlanarak Türkiye\'de nüfusun dağılışının neden ve sonuçlarını tartışır.',
                  '02.01.02 Tablo ve grafiklerden yararlanarak, ülkemiz nüfusunun özellikleri ile ilgili verileri yorumlar',
                  '02.01.03 Eğitim ve çalışma hakkının kullanılması ile devletin ve vatandaşın bu konudaki sorumluluklarını ilişkilendirir.',
                  '02.01.04 Örnek incelemeler yoluyla göçün neden ve sonuçlarını tartışır.',
                  '02.01.05 Yerleşme ve seyahat özgürlüğünü açıklar.',
                  '02.01.06 Ülkemizde çalışanların haklarını korumak amacıyla kurulan kuruluşları ayırt eder.'
                ]
              },
              {
                konu: '03.01 Kültür ve Miras / Türk Tarihinde Yolculuk',
                kazanimlar: [
                  '03.01.01 Türkiye Selçukluları döneminde Türklerin siyasal mücadeleleri ve kültürel faaliyetlerinin Anadolu\'nun Türkleşme sürecine katkılarını değerlendirir.',
                  '03.01.02 Kanıtlara dayanarak Osmanlı Devleti\'nin siyasi güç olarak ortaya çıkışını etkileyen faktörleri açıklar.',
                  '03.01.03 Osmanlı Devleti\'nin fetih ve mücadelelerini, Osmanlı\'da ticaretin ve denizlerin önemi açısından değerlendirir.',
                  '03.01.04 Osmanlı toplumunda hoşgörü ve birlikte yaşama fikrinin önemine dayalı kanıtlar gösterir.',
                  '03.01.05 Şehir incelemesi yoluyla, Türk kültür, sanat ve estetik anlayışındaki değişim ve sürekliliğe ilişkin kanıtlar gösterir.',
                  '03.01.06 Osmanlı- Avrupa ilişkileri çerçevesinde kültür, sanat ve estetik anlayışındaki etkileşimi fark eder.',
                  '03.01.07 Seyahatnamelerden hareketle Türk kültürüne ait unsurları örneklendirir.',
                  '03.01.08 Osmanlı Devleti\'nde ıslahat hareketleri sonucu ortaya çıkan kurumlardan hareketle toplumsal ve ekonomik değişim hakkında çıkarımlarda bulunur.',
                  '03.02.01 Büyük Selçuklu Devleti dönemindeki askeri, siyasi, kültürel faaliyetlerin, Anadolu\'nun Türkleşmesi sürecindeki katkılarını değerlendirir.',
                  '03.03.01 1.Beylikler Dönemi\'nde kurulan beyliklerin Anadolu\'nun Türkleşmesi sürecindeki katkılarını analiz eder.',
                  '03.04.01 Osmanlı Devleti\'nin Kuruluş ve Yükselme Dönemi padişahlarının askeri,siyasi,devlet teşkilatlanması alanlarındaki faaliyetlerini değerlendirir.',
                  '03.05.01 Osmanlı Devleti\'nde ordu teşkilatının bölümleri ve divan üyelerinin görevleri ile ilgili çıkarımlarda bulunur.'
                ]
              },
              {
                konu: '04.01 Bilim, Teknoloji ve Toplum / Zaman İçinde Bilim',
                kazanimlar: [
                  '04.01.01 İlk uygarlıkların bilimsel ve teknolojik gelişmelere katkılarına örnekler verir.',
                  '04.01.02 İlkyazı örneklerinden yola çıkarak yazının kullanım alanlarını ve bilgi aktarımındaki önemini fark eder',
                  '04.01.03 Türk ve İslam devletlerinde yetişen bilginlerin bilimsel gelişme sürecine katkılarını değerlendirir.',
                  '04.01.04 15–19. yüzyıllar arasında Avrupa\'da yaşanan gelişmelerin günümüz bilimsel birikiminin oluşmasına etkilerini fark eder.',
                  '04.01.05 Tarihsel süreçte düşünceyi ifade etme ve bilim özgürlüklerini bilimsel gelişmelerle ilişkilendirir.'
                ]
              },
              {
                konu: '05.01 Üretim, Dağıtım ve Tüketim / Ekonomi ve Sosyal Hayat',
                kazanimlar: [
                  '05.01.01 Üretimde ve yönetimde toprağın önemini tarihten örneklerle açıklar.',
                  '05.01.02 Kaynakların, ürünlerin ve ticaret yollarının devletlerin gelişmesindeki önemine tarihten ve günümüzden örnekler verir.',
                  '05.01.03 Tarihten ve günümüzden örnekler vererek üretim teknolojisindeki gelişmelerin sosyal ve ekonomik hayata etkilerini değerlendirir.',
                  '05.01.04 Vakıfların çalışmalarına ve sosyal yaşamdaki rolüne tarihten ve günümüzden örnekler verir.',
                  '05.01.05 Tarih boyunca Türklerde meslek edindirme ve meslek etiği kazandırmada rol oynayan kurumları tanır.',
                  '05.01.06 Eğitimin meslek edindirme hedefini kavrayarak ilgi ve yetenekleri doğrultusunda meslekî tercihlerine yönelik planlama yapar.',
                  '05.02.01 Ülkemizde tarımın gelişmesi amacıyla hizmet veren kuruluşları ve amaçlarını ayırt eder.'
                ]
              },
              {
                konu: '06.01 Güç, Yönetim ve Toplum / Yaşayan Demokrasi',
                kazanimlar: [
                  '06.01.01 Tarihsel süreçte Türk devletlerinde yönetim şekli ve egemenlik anlayışındaki değişim ve sürekliliği fark eder.',
                  '06.01.02 Anayasamızın 2. maddesinde yer alan Türkiye Cumhuriyeti Devleti\'nin nitelikleri ile ilgili uygulamalara toplum hayatından örnekler verir.',
                  '06.01.03 Türkiye Cumhuriyeti Devleti\'nin yönetim yapısını yasama, yürütme ve yargı kavramları çerçevesinde analiz eder.',
                  '06.01.04 Siyasî partilerin, sivil toplum örgütlerinin, medyanın ve bireylerin, gündemi ve yönetimin karar alma süreçlerini ne şekilde etkilediğini örnekler üzerinden tartışır.',
                  '06.01.05 İçinde bulunduğu eğitsel ve sosyal faaliyetlerde işleyen süreçleri demokrasinin ilkeleri açısından analiz eder.',
                  '06.02.01 Vatandaşlık kavramını ve sorumluluklarını kavrar.',
                  '06.03.01 Atatürk\'ün gerçekleştirdiği inkılapların toplumda yerleşmesinde,basın-yayın organları ve sanatsal faaliyetlerin rolünü analiz eder.'
                ]
              },
              {
                konu: '07.01 Küresel Bağlantılar / Ülkeler Arası Köprüler',
                kazanimlar: [
                  '07.01.01 20. Yüzyılın başında Osmanlı Devleti ve Avrupa ülkelerinin siyasî ve ekonomik yapısıyla I. Dünya Savaşı\'nın sebep ve sonuçlarını ilişkilendirir.',
                  '07.01.02 Küresel sorunlarla uluslararası kuruluşların kuruluş amaçlarını ilişkilendirir.',
                  '07.01.03 Küresel sorunların çözümlerinin yaşama geçirilmesinde kişisel sorumluluğunu fark eder.',
                  '07.01.04 Düşünce, sanat ve edebiyat ürünlerinin, doğal varlıkların ve tarihi çevrelerin ortak miras ögesi olarak yaşatılmasında insanlığın sorumluluğunun farkına varır.'
                ]
              }
            ]
          },
          {
            sinif: '08',
            konular: [
              {
                konu: 'İTA.01 Bir Kahraman Doğuyor',
                kazanimlar: [
                  'İTA.01.01 Atatürk\'ün çocukluk dönemini ve bu dönemde içinde bulunduğu toplumun sosyal ve kültürel yapısını analiz eder.',
                  'İTA.01.02 Atatürk\'ün öğrenim hayatı ile ilgili olay ve olguları kavrar.',
                  'İTA.01.03 Atatürk\'ün askerlik hayatı ile ilgili olay ve olguları kavrar.',
                  'İTA.01.04 Örnek olaylardan yola çıkarak Atatürk\'ün çeşitli cephelerdeki başarılarıyla askerî yeteneklerini ilişkilendirir.',
                  'İTA.01.05 Atatürk\'ün fikir hayatının oluşumuna ve gelişimine etki eden Selanik, Manastır, Sofya ve İstanbul şehirlerindeki ortamın rolünü fark eder.',
                  'İTA.01.06 Atatürk\'ün 1919\'a kadar bulunduğu görevler ve yaptığı hizmetleri, üstlendiği Millî Mücadele liderliği açısından yorumlar.',
                  'İTA.01.07 Atatürk\'ün çeşitli yönlerini ayırt eder.'
                ]
              },
              {
                konu: 'İTA.02 Milli Uyanış: Yurdumuzun İşgaline Tepkiler',
                kazanimlar: [
                  'İTA.02.01 I. Dünya Savaşı\'nda Osmanlı Devleti\'nin durumunu, topraklarının paylaşılması ve işgali açısından değerlendirir.',
                  'İTA.02.02 Mondros Ateşkes Anlaşması\'nın imzalanması ve uygulanması karşısında Osmanlı yönetiminin, Mustafa Kemal\'in ve halkın tutumunu değerlendirir.',
                  'İTA.02.03 Kuvâ-yı Millîye ruhunun oluşumunu, millî cemiyetleri ve millî varlığa düşman cemiyetlerin faaliyetlerini analiz eder.',
                  'İTA.02.04 Mustafa Kemal\'in Millî Mücadelenin hazırlık döneminde yaptığı çalışmaları millî bilincin uyandırılması, millî birlik ve beraberliğin sağlanması açısından değerlendirir.',
                  'İTA.02.05 Misak-ı Millî\'nin kabulünü ve Türkiye Büyük Millet Meclisi\'nin açılışını ulusal egemenlik , tam bağımsızlık ilkeleri ve vatanın bütünlüğü esası ile ilişkilendirir.',
                  'İTA.02.06 Hıyanet-i Vataniye Kanunu\'nun çıkarılma gerekçelerini ve uygulama sürecini değerlendirir.',
                  'İTA.02.07 İstanbul yönetimince imzalanan Sevr Antlaşması\'na karşı Mustafa Kemal\'in ve Türk milletinin tutumunu değerlendirir.',
                  'İTA.02.08 Mustafa Kemal\'in Millî Mücadeleyi örgütlerken karşılaştığı sorunlara bulduğu çözüm yollarını, onun liderlik yeteneği ile ilişkilendirir.',
                  'İTA.02.09 1.Dünya Savaşı\'nın nedenlerini ve sonuçlarını analiz eder.',
                  'İTA.02.10 Osmanlı Devleti\'nin savaştığı cepheleri ayırt eder.',
                  'İTA.02.11 Wilson İlkeleri ve Paris Barış Konferansı\'nın 1.Dünya Savaşı\'nın sonuçlarına etkilerini analiz eder.',
                  'İTA.02.12 Tehcir Yasası\'nın çıkarılma nedenlerini analiz eder.',
                  'İTA.02.13 TBMM\'ye karşı çıkan isyanları ayırt eder.'
                ]
              },
              {
                konu: 'İTA.03 Ya İstiklal Ya Ölüm',
                kazanimlar: [
                  'İTA.03.01 Kurtuluş Savaşı\'nda Doğu ve Güney cephelerinde yapılan mücadeleleri, sebep ve sonuçları açısından değerlendirir.',
                  'İTA.03.02 Batı cephesinde Kuvâ-yı Millîye birliklerinin faaliyetlerini ve düzenli ordunun kurulmasını değerlendirir.',
                  'İTA 03.03 Kurtuluş Savaşı\'nın yaşandığı ortamda Atatürk\'ün Maarif Kongresi yaparak Türkiye\'nin millî ve çağdaş eğitimine verdiği önemi kavrar.',
                  'İTA.03.04 Türk milletinin millî birlik, beraberlik ve dayanışmasının ifadesi olarak Tekâlif-i Millîye Kararları\'nın uygulamalarını inceler.',
                  'İTA.03.05 Sakarya Meydan Savaşı\'nın ve Büyük Taarruz\'un kazanılmasında Atatürk\'ün rolünü fark eder.',
                  'İTA.03.06 Türk milletinin Kurtuluş Savaşı sürecinde elde ettiği askerî başarılarının ulusal ve uluslar arası etkilerini değerlendirir.',
                  'İTA.03.07 Örnek eser incelemeleri yaparak dönemin toplumsal olaylarının sanat ve edebiyat üzerine yansımalarını fark eder.',
                  'İTA.03.08 Batı Cephesi savaşlarını sebep ve sonuçları ile analiz eder.',
                  'İTA.03.09 Osmanlı Devleti\'nin çöküşünü hızlandıran etmenleri açıklar.'
                ]
              },
              {
                konu: 'İTA.04 Çağdaş Türkiye Yolunda Adımlar',
                kazanimlar: [
                  'İTA.04.01 Millî egemenlik anlayışının güçlendirilmesi sürecinde saltanatın kaldırılmasını değerlendirir.',
                  'İTA.04.02 Sevr ve Lozan Antlaşmalarını karşılaştırarak Lozan Antlaşması\'nın sağladığı kazanımları analiz eder.',
                  'İTA.04.03 İzmir İktisat Kongresi\'nde alınan kararları, millî iktisat anlayışı ve tasarruf bilinci açılarından inceler.',
                  'İTA.04.04 Ankara\'nın başkent oluşunun gerekçelerini açıklar.',
                  'İTA.04.05 Cumhuriyetin ilân edilmesini, Türkiye\'de demokrasi rejiminin gerekleri ile bağdaştırarak değerlendirir.',
                  'İTA.04.06 3 Mart 1924\'te kabul edilen kanunların gerekçelerini ve toplum hayatında meydana getirdiği değişimleri fark eder.',
                  'İTA.04.07 Atatürk\'ün çok partili siyasî hayata verdiği önemi kavrar.',
                  'İTA.04.08 Şapka ve Kıyafet İnkılâbını, tekke ve zaviyelerin kapatılmasını, miladî takvim ve uluslararası saat uygulamasının kabulünü millî kimlik kazanma ve çağdaşlaşma çerçevesinde değerlendirir.',
                  'İTA.04.09 Hukuk alanındaki gelişmeleri, Medeni Kanun\'un Türk aile yapısında ve kadının toplumdaki yerinde meydana getirdiği değişiklikleri analiz eder.',
                  'İTA.04.10 Şeyh Sait İsyanını çağdaş, demokratik ve laik Türkiye Cumhuriyeti\'ne karşı tepkiler ve uluslararası ilişkiler açısından değerlendirir.',
                  'İTA.04.11 Kabotaj Kanunu\'nu millî egemenlik hakları ve Türk denizciliğinde meydana getirdiği gelişmeler bakımından değerlendirir.',
                  'İTA.04.12 Mustafa Kemal\'e suikast girişimini cumhuriyete yönelik tehditler çerçevesinde yorumlar.',
                  'İTA.04.13 Büyük Nutuk\'un söyleniş amaçlarını, içeriğini ve tarihsel niteliğini kavrar.',
                  'İTA.04.14 Harf İnkılâbını ve Millet Mekteplerini, eğitimin yaygınlaştırılması ve çağdaş Türk toplumunun oluşturulması açılarından değerlendirir',
                  'İTA.04.15 Menemen Kubilay Olayını Türk milletinin cumhuriyet yönetimindeki kararlılığı ve çok partili siyasî hayata etkisi açısından değerlendirir.',
                  'İTA.04.16 Şehir incelemesi yoluyla Cumhuriyet Döneminde mimarlık ve şehir planlaması alanında yapılan çalışmalara örnekler verir.',
                  'İTA.04.17 Ölçü ve tartıların değişmesini çağdaşlaşma çerçevesinde değerlendirir.',
                  'İTA.04.18 Atatürk\'ün millî kültür ve millî kimlik oluşturmak ve geliştirmek için dil ve tarih alanında yaptığı çalışmaları değerlendirir.',
                  'İTA.04.19 1933 Üniversite Reformundan hareketle Atatürk\'ün bilimsel gelişme ve kalkınmaya verdiği önemi kavrar.',
                  'İTA.04.20 Soyadı Kanunu\'nun kabulünün gerekçelerini ve Mustafa Kemal\'e Atatürk soyadı verilmesini millî kimlik kazanma ve çağdaşlaşma çerçevesinde açıklar.',
                  'İTA.04.21 Atatürk\'ün kadınlara sağladığı sosyal ve siyasal hakları dönemin çeşitli ülkelerindeki kadın haklarıyla karşılaştırarak değerlendirir.',
                  'İTA.04.22 Atatürk Döneminde sağlık alanında yapılan işleri devletin temel görevleri bağlamında inceler.',
                  'İTA.04.23 Atatürk Orman Çiftliği örneğinden yola çıkarak Atatürk\'ün modern tarımın gelişimine ve çevre bilincine verdiği önemi fark eder.',
                  'İTA.04.24 Örnek olaylardan yararlanarak Atatürk\'ün sanata ve spora verdiği önemi fark eder.',
                  'İTA.04.25 Onuncu Yıl Nutku\'ndan hareketle yapılan inkılâpları, Atatürk\'ün geleceğe yönelik hedeflerini ve Türk milletinin özelliklerini değerlendirir.'
                ]
              },
              {
                konu: 'İTA.05 Atatürkçülük',
                kazanimlar: [
                  'İTA.05.01 Atatürkçülüğün amaç ve niteliklerini kavrar.',
                  'İTA.05.02 Dönemin şartlarını göz önünde bulundurarak dünyada ve ülkemizde Atatürk\'ün düşünce sisteminin oluşmasında etkili olan olaylar hakkında çıkarımlarda bulunur.',
                  'İTA.05.03 Millî güç unsurlarının Atatürk\'ün yönetim anlayışındaki yerini ve önemini kavrar.',
                  'İTA.05.04 Cumhuriyetçilik ilkesinin önemini ve cumhuriyet yönetiminin Türk toplumuna sağladığı faydaları kanıtlara dayalı olarak açıklar.',
                  'İTA.05.05 Bir Türk vatandaşı olarak cumhuriyetin Türk milletine kazandırdığı vatandaşlık temel hak ve sorumlulukları bilincini kazanır.',
                  'İTA.05.06 Atatürk\'ün milliyetçilik ilkesinden yola çıkarak millî birlik ve beraberliğin önemine inanır.',
                  'İTA.05.07 Atatürk ün Türkiye Cumhuriyeti ni kuran Türkiye halkına Türk milleti denir. özdeyişinden hareketle Ne mutlu Türküm diyene ifadesinin anlam ve önemini kavrar.',
                  'İTA.05.08 Millî egemenlik, eşitlik, adalet, demokratik hak kavramlarını Atatürkçü düşünce sistemindeki halkçılık ilkesi ile ilişkilendirir.',
                  'İTA.05.09 Devletçilik ilkesinin devlete siyasî, sosyal ve kültürel alanda yüklediği görevleri açıklar.',
                  'İTA.05.10 Ulusal ve uluslararası faktörlerin devletçilik ilkesinin benimsenmesindeki etkisini değerlendirir.',
                  'İTA.05.11 Laiklik ilkesinin devlet yönetimi, hukuk ve eğitim sistemi ile sosyal alanda meydana getirdiği değişimlerden yola çıkarak bu ilkenin temel esaslarını fark eder.',
                  'İTA.05.12 İnkılapçılık ilkesini, Türk ulusunun millî kültür değerlerini geliştirerek çağdaşlaşmasının bir aracı olarak kavrar.',
                  'İTA.05.13 Atatürk ilkelerinin amaçları ve ortak özellikleri hakkında çıkarımlarda bulunur.',
                  'İTA.05.14 Atatürkçü düşünce sisteminden yola çıkarak, Atatürk ilke ve inkılaplarını oluşturan temel esasları belirler.',
                  'İTA.05.15 Atatürk ilkelerinin modern Türkiye\'nin kuruluşu ve gelişmesindeki yerine ve önemine inanır.',
                  'İTA.05.16 Türk Milli Mücadelesinin ve Atatürkçülüğün, bağımsızlık savaşı veren mazlum milletlere örnek olduğunu fark eder.',
                  'İTA.05.17 Atatürk ilke ve inkılaplarına sahip çıkma ve devamlılığını sağlama konusunda kişisel sorumluluk alır.'
                ]
              },
              {
                konu: 'İTA.06 Atatürk Dönemi Türk Dış Politikası ve Atatürk\'ün Ölümü',
                kazanimlar: [
                  'İTA.06.01 Lozan Barış Antlaşması\'nın Türk dış politikasının gelişimine yaptığı etkileri değerlendirir.',
                  'İTA.06.02 Atatürk Dönemi Türk dış politikasının temel ilkelerini ve amaçlarını analiz ederek Türk dış politikası hakkında çıkarımlarda bulunur.',
                  'İTA.06.03 Atatürk\'ün Hatay\'ı ülkemize katmak konusunda yaptıklarını ve bu uğurda gösterdiği özveriyi fark eder.',
                  'İTA.06.04 Atatürk\'ün ölümü üzerine yayımlanan yazılı ve görsel kanıtlardan hareketle onun kişilik özellikleri ile fikir ve görüşlerinin evrensel değerine ilişkin çıkarımlarda bulunur.',
                  'İTA.06.05 Türk milletinin ulu önderine ebedî bağlılığını ve minnet duygusunu ifade etmek yönündeki çabalarını fark eder.',
                  'İTA.06.06 Atatürk Dönemi Türk dış politikasında meydana gelen gelişmeleri analiz eder.'
                ]
              },
              {
                konu: 'İTA.07 Atatürk\'ten Sonra Türkiye: İkinci Dünya Savaşı ve Sonrası',
                kazanimlar: [
                  'İTA.07.01 İkinci Dünya Savaşı\'nın sebep, süreç ve sonuçlarını Türkiye\'ye etkileri açısından değerlendirir.',
                  'İTA.07.02 Türkiye\'de çok partili siyasî hayata geçişi hızlandıran gelişmeleri demokrasinin gerekleri açısından inceler.',
                  'İTA.07.03 Türkiye\'nin dünya üzerindeki konumunun öneminden yola çıkarak İkinci Dünya Savaşı sonrası değişen ülkeler arası ilişkileri değerlendirir.',
                  'İTA.07.04 İkinci Dünya Savaşı\'ndan sonra Türkiye\'de meydana gelen toplumsal, kültürel ve ekonomik gelişmeleri fark eder.',
                  'İTA.07.05 1945 sonrası insan hak ve özgürlükleri ile demokratik anlayışın gelişimine yönelik uygulamalara örnekler verir.',
                  'İTA.07.06 Türk Silahlı Kuvvetlerinin önemini ve görevlerini kavrar.',
                  'İTA.07.07 Türkiye Cumhuriyeti\'nin temel niteliklerine yönelik iç ve dış tehditlere karşı korunması konusunda duyarlı olur.',
                  'İTA.07.08 SSCB\'nin dağılmasının dünyaya ve ülkemize etkileri hakkında çıkarımlarda bulunur.',
                  'İTA.07.09 Türkiye ve yakın çevresindeki enerji kaynaklarının siyasî ve ekonomik önemini değerlendirir.',
                  'İTA.07.10 Körfez Savaşlarının Türkiye\'ye siyasî, sosyal, askeri ve ekonomik etkilerini değerlendirir.',
                  'İTA.07.11 Doğal kaynaklardan verimli şekilde yararlanmaya yönelik projeleri ülkemizin kalkınma politikaları çerçevesinde değerlendirir.',
                  'İTA.07.12 Türkiye-Avrupa Birliği ilişkilerini tarihsel gelişimi açısından analiz eder.',
                  'İTA.07.13 Ermeni Meselesi\'nin 1.Dünya Savaşı öncesi ve sonrası durumu hakkında çıkarımda bulunur.'
                ]
              }
            ]
          }
        ]
      }
    ];

    _.each(dersler, function(ders) {
      var gorselId='';
      var butonAktifId='';
      var butonPasifId='';
      var gorsel = new FS.File();
      gorsel.attachData(
        FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/' + 'muhur/grup/' + ders.slug + '-gorsel.png')),
        {type: 'image/png'},
        function(err) {
          if (err) {
            M.L.ThrowError({error:'500',reason:'Mühür grubu dosya kaydedilemedi',details: err});
          } else {
            gorsel.name(ders.slug + '-gorsel.png');
            gorsel.updatedAt(new Date());
            gorsel.metadata = {};
            var gorselObj = M.FS.Muhur.insert(gorsel);
            gorselId = gorselObj._id;
          }

        }
      );
      var butonAktif = new FS.File();
      butonAktif.attachData(
        FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/' + 'muhur/grup/' + ders.slug + '-aktif.png')),
        {type: 'image/png'},
        function(err) {
          if (err) {
            M.L.ThrowError({error:'500',reason:'Mühür grubu dosya kaydedilemedi',details: err});
          } else {
            butonAktif.name(ders.slug + '-aktif.png');
            butonAktif.updatedAt(new Date());
            butonAktif.metadata = {};
            var butonAktifObj = M.FS.Muhur.insert(butonAktif);
            butonAktifId = butonAktifObj._id;
          }

        }
      );
      var butonPasif = new FS.File();
      butonPasif.attachData(
        FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/' + 'muhur/grup/' + ders.slug + '-pasif.png')),
        {type: 'image/png'},
        function(err) {
          if (err) {
            M.L.ThrowError({error:'500',reason:'Mühür grubu dosya kaydedilemedi',details: err});
          } else {
            butonPasif.name(ders.slug + '-pasif.png');
            butonPasif.updatedAt(new Date());
            butonPasif.metadata = {};
            var butonPasifObj = M.FS.Muhur.insert(butonPasif);
            butonPasifId = butonPasifObj._id;
          }

        }
      );

      var dersId = M.C.Dersler.insert({
        isim: ders.ders,
        muhurGrubu: {
          isim: ders.isim,
          gorsel: gorselId,
          butonAktif: butonAktifId,
          butonPasif: butonPasifId
        }
      });

      _.each(ders.mufredat, function(mufredat) {
        M.C.Mufredat.insert({
          kurum: 'mitolojix',
          egitimYili: M.E.EgitimYili[0],
          ders: dersId,
          sinif: mufredat.sinif,
          konular: mufredat.konular
        });
      });

      var sira = 1;
      _.each(ders.muhurler, function(muhur) {
        var muhurGorselId='';
        var muhurGorsel = new FS.File();
        muhurGorsel.attachData(
          FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/' + 'muhur/' + muhur.seviye + '/' + ders.slug + '/' + muhur.slug + '.png')),
          {type: 'image/png'},
          function(err) {
            if (err) {
              M.L.ThrowError({error:'500',reason:'Mühür dosya kaydedilemedi',details: err});
            } else {
              muhurGorsel.name(ders.slug + '-'+ muhur.slugYeni + '.png');
              muhurGorsel.updatedAt(new Date());
              muhurGorsel.metadata = {};
              var muhurGorselObj = M.FS.Muhur.insert(muhurGorsel);
              muhurGorselId = muhurGorselObj._id;
            }
          }
        );
        M.C.Muhurler.insert({
          ders: dersId,
          isim: muhur.isim,
          sira: sira,
          gorsel: muhurGorselId
        });
        sira++;
      });

    });

  }
});
