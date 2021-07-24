class SayHello {
   constructor(img) {
      this.img = img;
      this.$body = document.querySelector('body')
   }
   render() {
      const img = document.createElement('img');
      img.setAttribute('src', this.img);
      this.$body.append(img)
   }
   sayHello() {
      console.log('hello')
   }
}

export default SayHello