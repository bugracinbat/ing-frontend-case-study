import { expect } from '@open-wc/testing';
import { LocalizationService } from '../src/services/localization.js';

describe('LocalizationService', () => {
  let originalLang;

  beforeEach(() => {
    originalLang = document.documentElement.lang;
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    document.documentElement.lang = originalLang;
  });

  describe('getCurrentLanguage', () => {
    it('returns current language from document', () => {
      document.documentElement.lang = 'tr';
      expect(LocalizationService.getCurrentLanguage()).to.equal('tr');
    });

    it('returns "en" as default when no language is set', () => {
      document.documentElement.lang = '';
      expect(LocalizationService.getCurrentLanguage()).to.equal('en');
    });
  });

  describe('setLanguage', () => {
    it('sets the document language', () => {
      LocalizationService.setLanguage('tr');
      expect(document.documentElement.lang).to.equal('tr');
    });

    it('dispatches language-changed event', () => {
      let eventFired = false;
      let eventDetail = null;
      
      window.addEventListener('language-changed', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      LocalizationService.setLanguage('tr');
      
      expect(eventFired).to.be.true;
      expect(eventDetail).to.deep.equal({ language: 'tr' });
    });

    it('does not change language for invalid language code', () => {
      document.documentElement.lang = 'en';
      LocalizationService.setLanguage('invalid');
      expect(document.documentElement.lang).to.equal('en');
    });
  });

  describe('getTranslation', () => {
    beforeEach(() => {
      document.documentElement.lang = 'en';
    });

    it('returns correct translation for simple key', () => {
      const translation = LocalizationService.getTranslation('navigation.list');
      expect(translation).to.equal('Employee List');
    });

    it('returns correct translation for nested key', () => {
      const translation = LocalizationService.getTranslation('employeeForm.firstName');
      expect(translation).to.equal('First Name');
    });

    it('returns key when translation is not found', () => {
      const key = 'nonexistent.key';
      const translation = LocalizationService.getTranslation(key);
      expect(translation).to.equal(key);
    });

    it('returns translations in different languages', () => {
      document.documentElement.lang = 'tr';
      const translation = LocalizationService.getTranslation('navigation.list');
      expect(translation).to.equal('Çalışan Listesi');
    });
  });

  describe('getAvailableLanguages', () => {
    it('returns array of available languages', () => {
      const languages = LocalizationService.getAvailableLanguages();
      expect(languages).to.deep.equal(['en', 'tr']);
    });

    it('returns non-empty array', () => {
      const languages = LocalizationService.getAvailableLanguages();
      expect(languages.length).to.be.greaterThan(0);
    });
  });
}); 