var OTO = OTO || {};

OTO.BubbleGenerator = class {
    constructor(container, options) {
        this.container = container;
        this.options = options;

        // this.getMousePos = this.getMousePos.bind(this);
    }

    constructHtml() {
        this.container.classList.add('oto-bubbles-generator');

        // Add audio player
        if (this.options.audio === true) {
            const bubblesAudio = document.createElement('audio');
            bubblesAudio.classList.add('oto-bubbles-audio');
            bubblesAudio.autoplay = true;
            bubblesAudio.loop = true;
            bubblesAudio.muted = false;
            bubblesAudio.src = 'assets/audio/Water Bubble Sound FX Royalty Free Music.mp3';
            this.container.appendChild(bubblesAudio);

            const audioPopMessage = document.createElement('div');
            audioPopMessage.classList.add('oto-bubbles-audioPopMessage');
            audioPopMessage.innerHTML = '<p>You can toggle audio by pressing "<b>M</b>" key.</p>';
            document.body.appendChild(audioPopMessage);

            setTimeout(() => {
                audioPopMessage.classList.add('visible');
            }, 1000);

            setTimeout(() => {
                audioPopMessage.classList.remove('visible');
            }, 5000);

            document.addEventListener('keypress', function (e) {
                if (e.keyCode === 109) {
                    bubblesAudio.muted = !bubblesAudio.muted;
                }
            });
        }

        // Add the wrapper of bubbles
        const bubblesWrapper = document.createElement('div');
        bubblesWrapper.classList.add('oto-bubbles-wrapper');
        this.container.appendChild(bubblesWrapper);

        // Add the Glass
        const bubblesGlass = document.createElement('div');
        bubblesGlass.classList.add('oto-bubbles-glass');
        this.container.appendChild(bubblesGlass);

        let bubblesLength = 0;

        if (typeof this.options.bubbles === 'number') {
            bubblesLength = this.options.bubbles;
        } else if (typeof this.options.bubbles === 'string') {
            bubblesLength = parseInt(this.options.bubbles, 10);
            console.warn('Please provide a number value.');
        } else {
            bubblesLength = 30;
        }

        // Add bubbles
        for (let i = 0; i < bubblesLength; i++) {
            const bubbleEl = document.createElement('span');
            bubbleEl.classList.add('bubble');
            bubblesWrapper.appendChild(bubbleEl);
        }
    }

    getMousePos() {
        const bubbleGlass = this.container.querySelector('.oto-bubbles-glass');
        let x = this.container.offsetWidth / 2 - bubbleGlass.offsetWidth / 2;
        let y = this.container.offsetHeight - bubbleGlass.offsetHeight;
        let XPos = x;
        let YPos = y;

        bubbleGlass.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        this.container.addEventListener('mousemove', e => {
            x = e.clientX;
            y = e.clientY;

            XPos = x;
            YPos = y;

            if (x > this.container.offsetWidth - bubbleGlass.offsetWidth) {
                XPos = this.container.offsetWidth - bubbleGlass.offsetWidth;
            }

            if (y > this.container.offsetHeight - bubbleGlass.offsetHeight) {
                YPos = this.container.offsetHeight - bubbleGlass.offsetHeight;
            }

            if (y < 200) {
                YPos = 200;
            }

            bubbleGlass.style.transform = `translate3d(${XPos}px, ${YPos}px, 0)`;
        });
    }

    animateBubbles() {
        const bubbleGlass = this.container.querySelector('.oto-bubbles-glass');
        const bubbles = this.container.querySelector('.oto-bubbles-wrapper').querySelectorAll('.bubble');

        for(let i = 0; i < bubbles.length; i++) {
            let x = this.container.offsetWidth / 2 - bubbles[i].offsetWidth / 2;
            let y = this.container.offsetHeight - bubbleGlass.offsetHeight;

            let XTarget = x;
            let YTarget = -bubbles[i].offsetHeight;
            let XProgress = x;
            let YProgress = y;

            let bubbleEl = bubbles[i];

            this.container.addEventListener('mousemove', e => {
                x = e.clientX + bubbleGlass.offsetWidth / 2 - bubbleEl.offsetHeight / 2;
                y = e.clientY - bubbleEl.offsetHeight / 2;

                if (e.clientX > this.container.offsetWidth - bubbleGlass.offsetWidth) {
                    x = this.container.offsetWidth - bubbleGlass.offsetWidth / 2 - bubbleEl.offsetHeight / 2;
                }
    
                if (e.clientY > this.container.offsetHeight - bubbleGlass.offsetHeight) {
                    y = this.container.offsetHeight - bubbleGlass.offsetHeight - bubbleEl.offsetHeight / 2;
                }
    
                if (e.clientY < 200) {
                    y = 200  - bubbleEl.offsetHeight / 2;
                }
            });

            // Alternate false/true random for bubbles Left/Right orientation
            let XOrt = Math.random() >= 0.5;

            let XPt = Math.random() * 99;
            let YPt = Math.random() * 12;
            let XPtNew = XPt;
            let YPtNew = YPt;

            function animate() {
                XPt = Math.random() * 99;
                XPtNew += 0.1;
                // YPtNew += 0.0001;

                if (YProgress < YTarget) {
                    XPtNew = XPt;
                    XProgress = x;
                    YProgress = y;
                } else {
                    if (XOrt === true) {
                        XProgress += Math.sin(0.025) * XPtNew;
                    } else {
                        XProgress -= Math.sin(0.025) * XPtNew;
                    }
                    YProgress -= Math.sin(1) * YPtNew;
                }

                bubbleEl.style.transform = `translate3d(${XProgress}px, ${YProgress}px, 0)`;

                requestAnimationFrame(animate);

            }

            requestAnimationFrame(animate);
        }

    }

    generate() {
        this.constructHtml();
        this.getMousePos();
        this.animateBubbles();
    };
}