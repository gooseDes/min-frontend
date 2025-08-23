import { useEffect, useRef } from 'react';
import { address } from './wsClient';
import './App.css'
import './Signup.css'
import { showError } from './utils';

function SignupPage() {
    const particles = useRef([]);
    useEffect(() => {
        for (let i=0; i<100; i++) {
            particles.current.push({ x: window.innerWidth/100*i, y: Math.random()*window.innerHeight, speed: Math.random()+0.5, index: i });
        }
        const canvas = document.getElementById('bg_canvas');
        const ctx = canvas.getContext('2d');

        let lastTime = performance.now();

        function update() {
            const currentTime = performance.now()
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            particles.current.forEach((particle) => {
                ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI);
                particle.x = window.innerWidth/100*particle.index + Math.sin((performance.now()+(particle.index*2))*0.005)*particle.speed*10;
                particle.y += deltaTime * particle.speed * 12;
                if (particle.y > window.innerHeight) {
                    particle.y = -10;
                }
            });
            ctx.fillStyle = '#ffffff55';
            ctx.fill();
            requestAnimationFrame(update);
        }

        const signup_form = document.getElementById('signup_form');
        signup_form.style.scale = '1';
        signup_form.style.opacity = '1';
        setTimeout(() => {document.getElementById('bg_thing2').style.scale = '1'}, 500);
        setTimeout(() => {document.getElementById('bg_thing1').style.scale = '1'}, 1200);

        update();
    }, []);

    function handleRegistration() {
        const email_input = document.getElementById('email_input');
        const login_input = document.getElementById('login_input');
        const password_input = document.getElementById('password_input');
        const password2_input = document.getElementById('password2_input');
        const signup_form = document.getElementById('signup_form');
        if (password_input.value !== password2_input.value) {
            showError('Passwords do not match');
            signup_form.classList.add('error');
            setTimeout(() => {
                signup_form.classList.remove('error');
            }, 1000);
            return;
        }
        if (email_input.value.trim() === '' || login_input.value.trim() === '' || password_input.value.trim() === '') {
            signup_form.classList.add('error');
            setTimeout(() => {
                signup_form.classList.remove('error');
            }, 1000);
            return;
        }
        fetch(`${address}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email_input.value, username: login_input.value, password: password_input.value })
        }).then(response => {
            response.json().then(json => {
                if (response.ok) {
                    localStorage.setItem('token', json.token);
                    localStorage.setItem('email', email_input.value);
                    localStorage.setItem('username', login_input.value);
                    window.location.href = '/';
                } else {
                    showError(json.msg || 'Unknown error');
                    signup_form.classList.add('error');
                    setTimeout(() => {
                        signup_form.classList.remove('error');
                    }, 1000);
                }
            });
        });
    }
    
    return (
        <div className='App' id='app'>
            <canvas id='bg_canvas' />
            <div id='bg_thing1'></div>
            <div id='bg_thing2'></div>
            <div className='SignupForm' id='signup_form'>
                <input id='email_input' placeholder='Email' />
                <input id='login_input' placeholder='Login'/>
                <input id='password_input' placeholder='Password' type='password' />
                <input id='password2_input' placeholder='Password Confirmation' type='password' />
                <button id='signup_button' onClick={handleRegistration}>Sign Up</button>
            </div>
        </div>
    )
}


export default SignupPage