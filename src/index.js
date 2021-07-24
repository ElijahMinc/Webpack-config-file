import * as $ from 'jquery'; // импортируем все в долларов из библиотеки jquery

import SayHello from '@modules/SayHello';
import json from './products.json'
import img from '@/images/brand_2.png'

import Header from './js/Header';
import '@/styles/index.scss';

const body = document.querySelector('body');

const header = new Header('#header');

const hello = new SayHello(img);

console.log(img)

hello.sayHello();


hello.render()

header.render()