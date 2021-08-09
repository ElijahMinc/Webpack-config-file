import React from 'react'
import { render } from 'react-dom';
import img from './img/brand_2.png';
import img2 from './img/json.jpg';

import styles from './styles/index.module.css';
import json from './products.json'


const App = (
   <div>
      hello, Ilya
   </div>
)
console.log('asdasdsda')
render(App, document.getElementById('root'))

// console.log(json)
// console.log(json.products.forEach(element => element))

// const result = json.products.map(e => e)

// console.log(result)
// console.log('hello')
// const hello = document.querySelector('#text')

// hello.innerHTML = 'Hello'

// hello.classList.add(styles.hello)