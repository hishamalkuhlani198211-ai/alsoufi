import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "6ulLKjWr8n7TMIhBuJWfnkyJ5-um812xRSkgF9HiicM",
  authDomain: "alsoufi-rental.firebaseapp.com",
  projectId: "alsoufi-rental",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.book = async function(){
  let name=document.getElementById('name').value;
  let phone=document.getElementById('phone').value;
  let car=document.getElementById('car').value.split('|');
  let start=document.getElementById('start').value;
  let end=document.getElementById('end').value;

  if(!name||!phone||!start||!end){alert('Fill all fields');return;}

  let days=(new Date(end)-new Date(start))/(1000*60*60*24);
  let total=days*car[1];

  await addDoc(collection(db,"bookings"),{name,phone,car:car[0],days,total,start,end});
  alert('Booking Saved');
}

window.login = async function(){
  let email=document.getElementById('email').value;
  let password=document.getElementById('password').value;
  try{
    await signInWithEmailAndPassword(auth,email,password);
  }catch(e){alert('Login Failed');}
}

onAuthStateChanged(auth, async (user)=>{
  if(user){
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadBookings();
  }else{
    document.getElementById('loginBox').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
  }
});

async function loadBookings(){
  let snapshot=await getDocs(collection(db,"bookings"));
  let html="";
  snapshot.forEach(docSnap=>{
    let d=docSnap.data();
    html+=`<div>${d.name} - ${d.car} - ${d.total}$ <button onclick="deleteBooking('${docSnap.id}')">🗑️</button></div>`;
  });
  document.getElementById('orders').innerHTML=html;
}

window.deleteBooking = async function(id){
  await deleteDoc(doc(db,"bookings",id));
  loadBookings();
}

window.logout = function(){signOut(auth)}

// Language toggle
let lang='ar';
window.toggleLang=function(){
  lang = lang==='ar' ? 'en':'ar';
  document.body.style.direction = lang==='ar'?'rtl':'ltr';
  document.getElementById('heroText').innerText = lang==='ar'?
    'تجربة فاخرة لتأجير السيارات':'Luxury Car Rental Experience';
  document.getElementById('carsTitle').innerText = lang==='ar'?
    'السيارات':'Cars';
  document.getElementById('bookingTitle').innerText = lang==='ar'?
    'الحجز':'Booking';
  document.getElementById('bookBtn').innerText = lang==='ar'?
    'احجز':'Book Now';
}