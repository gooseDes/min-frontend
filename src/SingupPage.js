import { useEffect, useRef } from 'react'
import './App.css'
import './Signup.css'

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
            ctx.fillStyle = '#ffffff66';
            ctx.fill();
            requestAnimationFrame(update);
        }

        update();
    }, []);

    return (
        <div className='App' id='app'>
            <canvas id='bg_canvas' />
            <div id='bg_thing1'></div>
            <div id='bg_thing2'></div>
            <div className='SignupForm'>
                <input id='email_input' placeholder='Email' />
                <input id='login_input' placeholder='Login'/>
                <input id='password_input' placeholder='Password'/>
                <button id='singup_button'>Sign Up</button>
            </div>
        </div>
    )
}


export default SignupPage