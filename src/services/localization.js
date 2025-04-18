const translations = {
  en: {
    employeeList: {
      title: 'Employee List',
      searchPlaceholder: 'Search employees...',
      noRecords: 'No employee records found.',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phoneNumber: 'Phone',
      email: 'Email',
      department: 'Department',
      position: 'Position',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      tableView: 'Table View',
      listView: 'List View'
    },
    employeeForm: {
      addTitle: 'Add Employee',
      editTitle: 'Edit Employee',
      addButton: 'Save',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phoneNumber: 'Phone',
      email: 'Email Address',
      department: 'Department',
      position: 'Position',
      save: 'Save',
      update: 'Update',
      analytics: 'Analytics',
      tech: 'Tech',
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      back: 'Back to List',
      firstNamePlaceholder: 'Enter first name',
      lastNamePlaceholder: 'Enter last name',
      phoneNumberPlaceholder: 'Enter phone number',
      emailPlaceholder: 'Enter email address',
      selectDepartment: 'Select Department',
      selectPosition: 'Select Position'
    },
    navigation: {
      list: 'Employee List',
      add: 'Add New'
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of'
    },
    dialog: {
      title: 'Are you sure?',
      message: 'Selected Employee record of',
      willBeDeleted: 'will be deleted',
      cancel: 'Cancel',
      proceed: 'Proceed'
    }
  },
  tr: {
    employeeList: {
      title: 'Çalışan Listesi',
      searchPlaceholder: 'Çalışan ara...',
      noRecords: 'Kayıtlı çalışan bulunamadı.',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phoneNumber: 'Telefon',
      email: 'E-posta',
      department: 'Departman',
      position: 'Pozisyon',
      actions: 'İşlemler',
      edit: 'Düzenle',
      delete: 'Sil',
      tableView: 'Tablo Görünümü',
      listView: 'Liste Görünümü'
    },
    employeeForm: {
      addTitle: 'Çalışan Ekle',
      editTitle: 'Çalışan Düzenle',
      addButton: 'Kaydet',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phoneNumber: 'Telefon',
      email: 'E-posta Adresi',
      department: 'Departman',
      position: 'Pozisyon',
      save: 'Kaydet',
      update: 'Güncelle',
      analytics: 'Analitik',
      tech: 'Teknoloji',
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      back: 'Listeye Dön',
      firstNamePlaceholder: 'Adı girin',
      lastNamePlaceholder: 'Soyadı girin',
      phoneNumberPlaceholder: 'Telefon numarası girin',
      emailPlaceholder: 'E-posta adresi girin',
      selectDepartment: 'Departman Seçin',
      selectPosition: 'Pozisyon Seçin'
    },
    navigation: {
      list: 'Çalışan Listesi',
      add: 'Yeni Ekle'
    },
    pagination: {
      previous: 'Önceki',
      next: 'Sonraki',
      page: 'Sayfa',
      of: '/'
    },
    dialog: {
      title: 'Emin misiniz?',
      message: 'Seçilen çalışan kaydı',
      willBeDeleted: 'silinecektir',
      cancel: 'İptal',
      proceed: 'Devam Et'
    }
  }
};

export class LocalizationService {
  static getCurrentLanguage() {
    return document.documentElement.lang || 'en';
  }

  static setLanguage(lang) {
    if (translations[lang]) {
      document.documentElement.lang = lang;
      window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
    }
  }

  static getTranslation(key) {
    const lang = this.getCurrentLanguage();
    const keys = key.split('.');
    let translation = translations[lang];

    for (const k of keys) {
      if (!translation || !translation[k]) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
      translation = translation[k];
    }

    return translation;
  }

  static getAvailableLanguages() {
    return Object.keys(translations);
  }
} 