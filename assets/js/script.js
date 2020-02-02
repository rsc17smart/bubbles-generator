var OTO = OTO || {};

OTO.BubbleGenerator = class {
    constructor(container, options) {
        this.container = container;
        this.options = options;

        // this.getMousePos = this.getMousePos.bind(this);
    }

    constructHtml() {
        this.container.classList.add('oto-bubbles-generator');

        // Add parallax background
        const bubblesBackground = document.createElement('div');
        bubblesBackground.classList.add('oto-bubbles-background');
        this.container.appendChild(bubblesBackground);

        // Add audio player
        if (this.options.audio === true) {
            const bubblesAudio = document.createElement('audio');
            bubblesAudio.classList.add('oto-bubbles-audio');
            bubblesAudio.autoplay = true;
            bubblesAudio.loop = true;
            bubblesAudio.controls = true;
            bubblesAudio.muted = true;
            bubblesAudio.innerHTML = '<source src="assets/audio/Water Bubble Sound FX Royalty Free Music.mp3" type="audio/mpeg">';
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

            const audioStatus = document.createElement('div');
            audioStatus.classList.add('oto-bubbles-audioStatus');
            document.body.appendChild(audioStatus);

            let hideStatusMessage = null;

            function startHidingStatus() {
                hideStatusMessage = setTimeout(() => {
                    audioStatus.classList.remove('visible');
                }, 2000);
            }

            function resetHidingStatus() {
                clearTimeout(hideStatusMessage);
            }

            document.addEventListener('keypress', function (e) {
                if (e.keyCode === 109) {
                    bubblesAudio.muted = !bubblesAudio.muted;

                    if (bubblesAudio.muted === true) {
                        audioStatus.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    } else {
                        audioStatus.innerHTML = '<i class="fas fa-volume-up"></i>';
                        bubblesAudio.play();
                    }

                    audioStatus.classList.add('visible');

                    resetHidingStatus();
                    startHidingStatus();
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
        const bubblesBackground = this.container.querySelector('.oto-bubbles-background');
        const bubbleGlass = this.container.querySelector('.oto-bubbles-glass');
        let x = this.container.offsetWidth / 2 - bubbleGlass.offsetWidth / 2;
        let y = this.container.offsetHeight - bubbleGlass.offsetHeight;
        let XPos = x;
        let YPos = y;

        let XBgPos = 50 + XPos / 1000;
        let YBgPos = 50 + YPos / 1000;

        bubbleGlass.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;

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

            XBgPos = 50 + XPos / 1000;
            YBgPos = 50 + YPos / 1000;

            bubbleGlass.style.transform = `translate3d(${XPos}px, ${YPos}px, 0)`;
            bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;
        });
    }

    animateBubbles() {
        const bubbleGlass = this.container.querySelector('.oto-bubbles-glass');
        const bubbles = this.container.querySelector('.oto-bubbles-wrapper').querySelectorAll('.bubble');

        for(let i = 0; i < bubbles.length; i++) {
            let bubbleEl = bubbles[i];
            let x = this.container.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
            let y = this.container.offsetHeight - bubbleGlass.offsetHeight - bubbleEl.offsetHeight;

            let XTarget = x;
            let YTarget = -bubbleEl.offsetHeight;
            let XProgress = x;
            let YProgress = y;

            this.container.addEventListener('mousemove', e => {
                x = e.clientX + bubbleGlass.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
                y = e.clientY - bubbleEl.offsetHeight;

                if (e.clientX > this.container.offsetWidth - bubbleGlass.offsetWidth) {
                    x = this.container.offsetWidth - bubbleGlass.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
                }
    
                if (e.clientY > this.container.offsetHeight - bubbleGlass.offsetHeight) {
                    y = this.container.offsetHeight - bubbleGlass.offsetHeight - bubbleEl.offsetHeight;
                }
    
                if (e.clientY < 200) {
                    y = 200 - bubbleEl.offsetHeight;
                }
            });

            // Alternate false/true random for bubbles Left/Right orientation
            // let XOrt = Math.random() >= 0.5;

            let XPt = Math.random() * 9 + 1;
            let YPt = Math.random() * 9 + 1;
            let XPtNew = XPt;
            let YPtNew = YPt;

            function animate() {
                XPtNew += 0.038;

                if (YProgress > YTarget) {
                    XProgress = XProgress + Math.sin(XPtNew) * XPt;
                    YProgress -= Math.sin(1) * YPtNew;
                } else {
                    XPtNew = XPt;
                    XProgress = x + Math.sin(XPtNew) * XPt;
                    YProgress = y;
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