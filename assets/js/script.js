var OTO = OTO || {};

OTO.BubbleGenerator = class {
    constructor(container, options) {
        this.container = container;
        this.options = options;
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
    }

    initializeBubbles() {
        const bubblesBackground = this.container.querySelector('.oto-bubbles-background');
        const bubblesWrapper = this.container.querySelector('.oto-bubbles-wrapper');
        const bubbleGlass = this.container.querySelector('.oto-bubbles-glass');
        let bubblesLength = 0;

        if (typeof this.options.bubbles === 'number') {
            bubblesLength = this.options.bubbles;
        } else if (typeof this.options.bubbles === 'string') {
            bubblesLength = parseInt(this.options.bubbles, 10);
            console.warn('Please provide a number value.');
        } else {
            bubblesLength = 10;
        }

        let x = this.container.offsetWidth / 2 - bubbleGlass.offsetWidth / 2;
        let y = this.container.offsetHeight - bubbleGlass.offsetHeight;

        let XBgPos = 45 + x / 200;
        let YBgPos = 45 + y / 200;

        bubbleGlass.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;

        // Add bubbles
        for (let i = 0; i < bubblesLength; i++) {
            const bubbleEl = document.createElement('span');
            bubbleEl.classList.add('bubble');
            bubblesWrapper.appendChild(bubbleEl);

            let bubbleGenerated = 0;

            let XBPos = this.container.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
            let YBPos = this.container.offsetHeight - bubbleGlass.offsetHeight - bubbleEl.offsetHeight;
            let XGPos = this.container.offsetWidth / 2 - bubbleGlass.offsetWidth / 2;
            let YGPos = this.container.offsetHeight - bubbleGlass.offsetHeight;

            // let XTarget = x;
            let YTarget = -bubbleEl.offsetHeight;
            let XProgress = XBPos;
            let YProgress = YBPos;

            let XPt = Math.random() * 9 + 1;
            let YPt = Math.random() * 9 + 1;
            let XPtNew = XPt;
            let YPtNew = YPt;

            bubbleEl.style.transform = `translate3d(${XProgress}px, ${YProgress}px, 0)`;
            bubbleEl.style.opacity = '0';

            this.container.addEventListener('mousemove', e => {
                x = e.clientX;
                y = e.clientY;

                XBPos = x - bubbleEl.offsetWidth / 2;
                YBPos = y - bubbleEl.offsetHeight;

                XGPos = x - bubbleGlass.offsetWidth / 2;
                YGPos = y;

                if (x < bubbleGlass.offsetWidth / 2) {
                    XBPos = bubbleGlass.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
                    XGPos = 0;
                }

                if (x > this.container.offsetWidth - bubbleGlass.offsetWidth / 2) {
                    XBPos = this.container.offsetWidth - bubbleGlass.offsetWidth / 2 - bubbleEl.offsetWidth / 2;
                    XGPos = this.container.offsetWidth - bubbleGlass.offsetWidth;
                }
    
                if (y > this.container.offsetHeight - bubbleGlass.offsetHeight) {
                    YBPos = this.container.offsetHeight - bubbleGlass.offsetHeight - bubbleEl.offsetHeight;
                    YGPos = this.container.offsetHeight - bubbleGlass.offsetHeight;
                }
    
                if (y < 200) {
                    YBPos = 200 - bubbleEl.offsetHeight;
                    YGPos = 200;
                }

                XBgPos = 45 + x / 200;
                YBgPos = 45 + y / 200;

                bubbleGlass.style.transform = `translate3d(${XGPos}px, ${YGPos}px, 0)`;
                bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;

                if (bubbleGenerated === 0) {
                    bubbleEl.style.transform = `translate3d(${XBPos}px, ${YBPos}px, 0)`;
                }
            });

            setTimeout(() => {

                bubbleEl.style.opacity = '1';

                if (bubbleGenerated === 0) {
                    XProgress = XBPos;
                    YProgress = YBPos;
                }

                function animate() {
                    XPtNew += 0.038;

                    if (YProgress > YTarget) {
                        XProgress = XProgress + Math.sin(XPtNew) * XPt;
                        YProgress -= Math.sin(1) * YPtNew;
                    } else {
                        XPtNew = XPt;
                        XProgress = XBPos + Math.sin(XPtNew) * XPt;
                        YProgress = YBPos;
                    }

                    bubbleEl.style.transform = `translate3d(${XProgress}px, ${YProgress}px, 0)`;

                    requestAnimationFrame(animate);

                }

                requestAnimationFrame(animate);

                bubbleGenerated = 1;

            }, 100 * i);
        }
    }

    generate() {
        this.constructHtml();
        this.initializeBubbles();
    };
}