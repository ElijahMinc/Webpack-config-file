import style from './Header.module.css';

class Header {
   constructor($el) {
      this.$el = document.querySelector($el);
   }
   render() {
      this.$el.innerHTML = 'Its Header';
      this.$el.classList.add(style.header);
   }
}

export default Header;