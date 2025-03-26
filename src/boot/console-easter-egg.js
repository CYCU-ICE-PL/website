// 控制台彩蛋 - 在瀏覽器控制台輸入特定命令時觸發

// 定義彩蛋命令
const easterEggs = {
  'hackCycuIce': () => {
    console.log('%c恭喜你發現了控制台彩蛋！', 'color: green; font-size: 20px; font-weight: bold;');
    console.log('%c輸入以下命令來啟用不同的彩蛋：', 'color: blue;');
    console.log('%c- hackSystem(): 啟動系統破解模式', 'color: red; font-weight: bold;');
    console.log('%c- matrixEffect(): 觸發矩陣效果', 'color: purple;');
    console.log('%c- confettiParty(): 觸發五彩紙屑效果', 'color: purple;');
    console.log('%c- pixelMelt(): 觸發像素融化效果', 'color: orange;');
    console.log('%c- glitchScreen(): 觸發故障效果', 'color: cyan;');
    console.log('%c- spaceFlight(): 啟動太空飛行', 'color: blue;');
    console.log('%c- nyanCat(): 彩虹貓彩蛋', 'color: deeppink;');
    return '已解鎖控制台彩蛋命令！';
  },
  
  'hackSystem': () => {
    console.log('%c系統破解中...', 'color: red; font-size: 24px; font-weight: bold;');
    
    // 創建破解界面元素
    const hackOverlay = document.createElement('div');
    hackOverlay.style.position = 'fixed';
    hackOverlay.style.top = '0';
    hackOverlay.style.left = '0';
    hackOverlay.style.width = '100%';
    hackOverlay.style.height = '100%';
    hackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    hackOverlay.style.zIndex = '99999';
    hackOverlay.style.display = 'flex';
    hackOverlay.style.flexDirection = 'column';
    hackOverlay.style.justifyContent = 'center';
    hackOverlay.style.alignItems = 'center';
    hackOverlay.style.fontFamily = 'monospace';
    hackOverlay.style.color = '#0f0';
    hackOverlay.style.overflow = 'hidden';
    
    // 添加震動動畫
    document.body.style.animation = 'shake 0.5s ease-in-out infinite';
    const shakeKeyframes = `
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(5px); }
      }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shakeKeyframes;
    document.head.appendChild(styleSheet);
    
    // 添加標題
    const hackTitle = document.createElement('h1');
    hackTitle.textContent = 'PL可視化系統破解中...';
    hackTitle.style.color = '#ff0000';
    hackTitle.style.fontSize = '3rem';
    hackTitle.style.margin = '0 0 20px 0';
    hackTitle.style.textShadow = '0 0 10px #ff0000';
    hackOverlay.appendChild(hackTitle);
    
    // 添加進度條容器
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '80%';
    progressContainer.style.maxWidth = '600px';
    progressContainer.style.height = '30px';
    progressContainer.style.border = '2px solid #0f0';
    progressContainer.style.borderRadius = '15px';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.position = 'relative';
    progressContainer.style.marginBottom = '20px';
    hackOverlay.appendChild(progressContainer);
    
    // 添加進度條
    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#0f0';
    progressBar.style.transition = 'width 0.5s';
    progressContainer.appendChild(progressBar);
    
    // 添加進度文本
    const progressText = document.createElement('div');
    progressText.textContent = '0%';
    progressText.style.position = 'absolute';
    progressText.style.top = '50%';
    progressText.style.left = '50%';
    progressText.style.transform = 'translate(-50%, -50%)';
    progressText.style.color = '#fff';
    progressText.style.fontWeight = 'bold';
    progressContainer.appendChild(progressText);
    
    // 添加終端輸出區域
    const terminal = document.createElement('div');
    terminal.style.width = '80%';
    terminal.style.maxWidth = '600px';
    terminal.style.height = '200px';
    terminal.style.border = '2px solid #0f0';
    terminal.style.borderRadius = '5px';
    terminal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    terminal.style.padding = '10px';
    terminal.style.overflow = 'auto';
    terminal.style.color = '#0f0';
    terminal.style.fontFamily = 'monospace';
    terminal.style.fontSize = '14px';
    terminal.style.textAlign = 'left';
    terminal.style.marginTop = '20px';
    hackOverlay.appendChild(terminal);
    
    document.body.appendChild(hackOverlay);
    
    // 模擬破解過程
    const hackMessages = [
      '檢測系統漏洞中...',
      '連接到PL可視化系統...',
      '繞過防火牆...',
      '解密安全協議...',
      '獲取系統權限...',
      '植入後門...',
      '清除入侵痕跡...',
      '完成系統破解！'
    ];
    
    let progress = 0;
    const updateProgress = () => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
      
      if (progress < 100) {
        const messageIndex = Math.floor((progress / 100) * hackMessages.length);
        terminal.innerHTML += `> ${hackMessages[messageIndex]}<br>`;
        terminal.scrollTop = terminal.scrollHeight;
        
        setTimeout(updateProgress, 600);
      } else {
        terminal.innerHTML += `> ${hackMessages[hackMessages.length - 1]}<br>`;
        terminal.innerHTML += `> 系統已被完全破解！<br>`;
        terminal.innerHTML += `> 歡迎，管理員！<br>`;
        terminal.scrollTop = terminal.scrollHeight;
        
        // 停止震動
        document.body.style.animation = '';
        
        // 顯示成功消息並在3秒後關閉覆蓋層
        hackTitle.textContent = '破解成功！';
        hackTitle.style.color = '#0f0';
        hackTitle.style.textShadow = '0 0 10px #0f0';
        
        // 增加閃爍效果
        document.body.style.animation = 'flash 0.2s ease-in-out 5';
        const flashKeyframes = `
          @keyframes flash {
            0% { filter: brightness(1); }
            50% { filter: brightness(2); }
            100% { filter: brightness(1); }
          }
        `;
        const flashStyleSheet = document.createElement('style');
        flashStyleSheet.textContent = flashKeyframes;
        document.head.appendChild(flashStyleSheet);
        
        setTimeout(() => {
          // 淡出效果
          hackOverlay.style.transition = 'opacity 1s';
          hackOverlay.style.opacity = '0';
          
          setTimeout(() => {
            document.body.removeChild(hackOverlay);
          }, 1000);
        }, 3000);
      }
    };
    
    updateProgress();
    
    return '系統破解已啟動！';
  },
  
  'pixelMelt': () => {
    // 創建一個覆蓋層
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '99999';
    overlay.style.pointerEvents = 'none';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    document.body.appendChild(overlay);
    
    // 創建融化效果
    const meltContainer = document.createElement('div');
    meltContainer.style.position = 'absolute';
    meltContainer.style.top = '0';
    meltContainer.style.left = '0';
    meltContainer.style.width = '100%';
    meltContainer.style.height = '100%';
    meltContainer.style.overflow = 'hidden';
    overlay.appendChild(meltContainer);
    
    // 創建液體滴落效果
    const dropCount = 100;
    const drops = [];
    
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.style.position = 'absolute';
      drop.style.width = `${Math.random() * 20 + 5}px`;
      drop.style.height = `${Math.random() * 100 + 20}px`;
      drop.style.borderRadius = '50% 50% 0 0';
      
      // 使用隨機顏色
      const hue = Math.floor(Math.random() * 360);
      drop.style.backgroundColor = `hsla(${hue}, 100%, 50%, 0.8)`;
      drop.style.boxShadow = `0 0 10px hsla(${hue}, 100%, 50%, 0.5)`;
      
      // 隨機位置
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = `${Math.random() * 50}%`;
      
      // 添加到容器
      meltContainer.appendChild(drop);
      drops.push({
        element: drop,
        speed: Math.random() * 5 + 1,
        position: parseFloat(drop.style.top)
      });
    }
    
    // 動畫循環
    let animationId;
    const animateMelt = () => {
      drops.forEach(drop => {
        drop.position += drop.speed;
        drop.element.style.top = `${drop.position}%`;
        
        // 如果超出螢幕，重置到頂部
        if (drop.position > 100) {
          drop.position = -10;
          drop.element.style.top = `${drop.position}%`;
          drop.element.style.left = `${Math.random() * 100}%`;
        }
        
        // 隨機改變尺寸
        if (Math.random() < 0.01) {
          drop.element.style.width = `${Math.random() * 20 + 5}px`;
          drop.element.style.height = `${Math.random() * 100 + 20}px`;
        }
      });
      
      animationId = requestAnimationFrame(animateMelt);
    };
    
    animationId = requestAnimationFrame(animateMelt);
    
    // 添加文字效果
    const meltText = document.createElement('div');
    meltText.textContent = '畫面融化中...';
    meltText.style.position = 'absolute';
    meltText.style.top = '50%';
    meltText.style.left = '50%';
    meltText.style.transform = 'translate(-50%, -50%)';
    meltText.style.color = '#fff';
    meltText.style.fontFamily = 'monospace';
    meltText.style.fontSize = '3rem';
    meltText.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    meltText.style.animation = 'meltTextAnimate 2s infinite alternate';
    overlay.appendChild(meltText);
    
    // 添加文字動畫
    const textAnimation = document.createElement('style');
    textAnimation.textContent = `
      @keyframes meltTextAnimate {
        0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
      }
    `;
    document.head.appendChild(textAnimation);
    
    // 頁面扭曲效果
    document.body.style.filter = 'blur(5px) hue-rotate(90deg)';
    document.body.style.transition = 'filter 1s';
    
    // 6秒後移除效果
    setTimeout(() => {
      cancelAnimationFrame(animationId);
      document.body.style.filter = '';
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 1000);
    }, 6000);
    
    return '像素融化效果已啟動！';
  },
  
  'glitchScreen': () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '99999';
    overlay.style.pointerEvents = 'none';
    overlay.style.overflow = 'hidden';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
    document.body.appendChild(overlay);
    
    // 創建故障效果區塊
    for (let i = 0; i < 20; i++) {
      const glitchBlock = document.createElement('div');
      glitchBlock.style.position = 'absolute';
      glitchBlock.style.top = Math.random() * 100 + '%';
      glitchBlock.style.left = Math.random() * 100 + '%';
      glitchBlock.style.width = Math.random() * 200 + 50 + 'px';
      glitchBlock.style.height = Math.random() * 50 + 10 + 'px';
      glitchBlock.style.backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      glitchBlock.style.backdropFilter = 'invert(100%)';
      glitchBlock.style.mixBlendMode = 'difference';
      glitchBlock.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
      glitchBlock.style.animation = `glitchMove ${Math.random() * 2 + 0.5}s infinite alternate`;
      overlay.appendChild(glitchBlock);
    }
    
    // 創建閃爍的線條
    for (let i = 0; i < 20; i++) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.height = Math.floor(Math.random() * 5) + 1 + 'px';
      line.style.width = '100%';
      line.style.backgroundColor = `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`;
      line.style.top = Math.floor(Math.random() * 100) + '%';
      line.style.left = '0';
      line.style.animation = `glitchLine ${Math.random() + 0.5}s infinite`;
      overlay.appendChild(line);
    }
    
    // 創建故障文字
    const glitchText = document.createElement('div');
    glitchText.textContent = 'ERROR';
    glitchText.style.position = 'absolute';
    glitchText.style.top = '50%';
    glitchText.style.left = '50%';
    glitchText.style.transform = 'translate(-50%, -50%)';
    glitchText.style.color = '#ff0000';
    glitchText.style.fontFamily = 'monospace';
    glitchText.style.fontSize = '5rem';
    glitchText.style.fontWeight = 'bold';
    glitchText.style.letterSpacing = '10px';
    glitchText.style.textShadow = '3px 3px 0 #00f, -3px -3px 0 #0f0';
    glitchText.style.animation = 'glitchText 0.3s infinite alternate';
    overlay.appendChild(glitchText);
    
    // 創建色彩偏移效果
    const glitchAnimation = `
      @keyframes glitchMove {
        0% { transform: translate(0) skew(0deg); }
        20% { transform: translate(-10px, 5px) skew(5deg); }
        40% { transform: translate(10px, -5px) skew(-5deg); }
        60% { transform: translate(-5px, 10px) skew(3deg); }
        80% { transform: translate(5px, -10px) skew(-3deg); }
        100% { transform: translate(0) skew(0deg); }
      }
      
      @keyframes glitchLine {
        0% { opacity: 0.8; transform: translateX(0); }
        50% { opacity: 0.3; transform: translateX(${Math.random() * 200 - 100}px); }
        100% { opacity: 0.8; transform: translateX(0); }
      }
      
      @keyframes glitchText {
        0% { 
          clip-path: inset(0 0 0 0);
          transform: translate(-50%, -50%); 
        }
        10% { 
          clip-path: inset(50% 0 0 0);
          transform: translate(-52%, -48%) skew(10deg); 
        }
        20% { 
          clip-path: inset(0 50% 0 0);
          transform: translate(-48%, -52%) skew(-10deg); 
        }
        30% { 
          clip-path: inset(0 0 50% 0);
          transform: translate(-51%, -49%); 
        }
        40% { 
          clip-path: inset(0 0 0 50%);
          transform: translate(-49%, -51%); 
        }
        50% { 
          clip-path: inset(30% 30% 30% 30%);
          transform: translate(-50%, -50%); 
        }
        100% { 
          clip-path: inset(0 0 0 0);
          transform: translate(-50%, -50%); 
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = glitchAnimation;
    document.head.appendChild(styleSheet);
    
    // 添加頁面扭曲效果
    document.body.style.filter = 'hue-rotate(180deg) contrast(1.5)';
    document.body.style.animation = 'glitchFilter 0.5s infinite';
    
    const bodyAnimation = document.createElement('style');
    bodyAnimation.textContent = `
      @keyframes glitchFilter {
        0% { filter: hue-rotate(180deg) contrast(1.5); }
        33% { filter: hue-rotate(210deg) contrast(1.8) brightness(1.2); }
        66% { filter: hue-rotate(150deg) contrast(1.3) brightness(0.8); }
        100% { filter: hue-rotate(180deg) contrast(1.5); }
      }
    `;
    document.head.appendChild(bodyAnimation);
    
    // 5秒後移除效果
    setTimeout(() => {
      document.body.style.filter = '';
      document.body.style.animation = '';
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 1000);
    }, 5000);
    
    return '故障效果已啟動！';
  },
  
  'spaceFlight': () => {
    // 創建太空容器
    const spaceContainer = document.createElement('div');
    spaceContainer.style.position = 'fixed';
    spaceContainer.style.top = '0';
    spaceContainer.style.left = '0';
    spaceContainer.style.width = '100%';
    spaceContainer.style.height = '100%';
    spaceContainer.style.background = 'linear-gradient(to bottom, #000000, #0a0a2a, #000000)';
    spaceContainer.style.zIndex = '99999';
    spaceContainer.style.overflow = 'hidden';
    
    // 創建太空中的星星
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      
      // 創建不同大小和亮度的星星
      const size = Math.random() * 3 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      star.style.opacity = Math.random() * 0.8 + 0.2;
      
      // 隨機放置星星
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      
      // 設置星星閃爍動畫
      star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite`;
      
      spaceContainer.appendChild(star);
    }
    
    // 創建航天器
    const spacecraft = document.createElement('div');
    spacecraft.style.position = 'absolute';
    spacecraft.style.bottom = '10%';
    spacecraft.style.left = '50%';
    spacecraft.style.transform = 'translateX(-50%)';
    spacecraft.style.width = '50px';
    spacecraft.style.height = '80px';
    spacecraft.style.background = 'silver';
    spacecraft.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
    spacecraft.style.animation = 'fly 15s forwards';
    spaceContainer.appendChild(spacecraft);
    
    // 添加火焰效果
    const flame = document.createElement('div');
    flame.style.position = 'absolute';
    flame.style.bottom = '-20px';
    flame.style.left = '50%';
    flame.style.transform = 'translateX(-50%)';
    flame.style.width = '30px';
    flame.style.height = '40px';
    flame.style.background = 'linear-gradient(to bottom, #ff5722, #ffeb3b)';
    flame.style.borderRadius = '0 0 50% 50%';
    flame.style.animation = 'flame 0.5s infinite alternate';
    spacecraft.appendChild(flame);
    
    // 創建行星
    const planet = document.createElement('div');
    planet.style.position = 'absolute';
    planet.style.top = '-200px';
    planet.style.left = '50%';
    planet.style.transform = 'translateX(-50%)';
    planet.style.width = '120px';
    planet.style.height = '120px';
    planet.style.borderRadius = '50%';
    planet.style.background = 'linear-gradient(to bottom right, #4CAF50, #009688)';
    planet.style.boxShadow = 'inset -15px -15px 20px rgba(0,0,0,0.5)';
    planet.style.animation = 'planetMove 15s forwards';
    spaceContainer.appendChild(planet);
    
    // 添加動畫風格
    const spaceStyle = document.createElement('style');
    spaceStyle.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }
      
      @keyframes fly {
        0% { bottom: 10%; transform: translateX(-50%) rotate(0deg); }
        20% { bottom: 25%; transform: translateX(-40%) rotate(-5deg); }
        40% { bottom: 45%; transform: translateX(-60%) rotate(5deg); }
        60% { bottom: 65%; transform: translateX(-45%) rotate(-3deg); }
        100% { bottom: 120%; transform: translateX(-50%) rotate(0deg); }
      }
      
      @keyframes flame {
        0% { height: 30px; }
        100% { height: 50px; }
      }
      
      @keyframes planetMove {
        0% { top: -200px; }
        30% { top: 30%; }
        100% { top: 120%; }
      }
    `;
    document.head.appendChild(spaceStyle);
    
    document.body.appendChild(spaceContainer);
    
    // 15秒後清理
    setTimeout(() => {
      spaceContainer.style.transition = 'opacity 1s';
      spaceContainer.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(spaceContainer);
      }, 1000);
    }, 15000);
    
    return '太空飛行模式已啟動！';
  },
  
  'nyanCat': () => {
    // 創建彩虹貓容器
    const nyanContainer = document.createElement('div');
    nyanContainer.style.position = 'fixed';
    nyanContainer.style.bottom = '0';
    nyanContainer.style.right = '-150px'; // 開始在視窗外
    nyanContainer.style.zIndex = '99999';
    nyanContainer.style.pointerEvents = 'none';
    
    // 創建彩虹軌跡
    const rainbow = document.createElement('div');
    rainbow.style.position = 'absolute';
    rainbow.style.right = '70px';
    rainbow.style.bottom = '22px';
    rainbow.style.height = '20px';
    rainbow.style.width = '0px'; // 初始寬度為0
    rainbow.style.background = 'linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet)';
    rainbow.style.borderRadius = '10px';
    rainbow.style.opacity = '0.7';
    nyanContainer.appendChild(rainbow);
    
    // 創建貓咪
    const cat = document.createElement('div');
    cat.style.position = 'relative';
    cat.style.width = '100px';
    cat.style.height = '70px';
    cat.style.background = '#999';
    cat.style.borderRadius = '10px';
    cat.style.overflow = 'hidden';
    cat.innerHTML = `
      <div style="
        position: absolute;
        top: 10px;
        left: 15px;
        right: 15px;
        bottom: 10px;
        background: #FE8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          font-size: 30px;
          color: black;
          font-weight: bold;
        ">:3</div>
      </div>
    `;
    
    // 添加跳動效果
    cat.style.animation = 'bounce 0.5s infinite alternate';
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
      @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
      
      @keyframes flyAcross {
        0% { right: -150px; }
        20% { right: 20%; }
        80% { right: 20%; }
        100% { right: 100%; }
      }
      
      @keyframes expandRainbow {
        0% { width: 0px; }
        20% { width: 150px; }
        80% { width: 150px; }
        100% { width: 0px; }
      }
      
      @keyframes nyanMusic {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(bounceStyle);
    
    nyanContainer.appendChild(cat);
    
    // 添加音符
    const addNotes = () => {
      setInterval(() => {
        if (document.body.contains(nyanContainer)) {
          const note = document.createElement('div');
          note.textContent = ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)];
          note.style.position = 'absolute';
          note.style.right = `${Math.random() * 100 + 80}px`;
          note.style.bottom = `${Math.random() * 60 + 10}px`;
          note.style.fontSize = '24px';
          note.style.color = ['#FF5722', '#4CAF50', '#2196F3', '#9C27B0'][Math.floor(Math.random() * 4)];
          note.style.animation = 'nyanMusic 0.5s, fadeOut 1.5s forwards';
          note.style.opacity = '0.8';
          
          nyanContainer.appendChild(note);
          
          // 1.5秒後移除音符
          setTimeout(() => {
            if (nyanContainer.contains(note)) {
              nyanContainer.removeChild(note);
            }
          }, 1500);
        }
      }, 300);
    };
    
    // 添加淡出動畫
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
      @keyframes fadeOut {
        0% { opacity: 0.8; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-20px) scale(0.5); }
      }
    `;
    document.head.appendChild(fadeOutStyle);
    
    document.body.appendChild(nyanContainer);
    
    // 設置動畫
    nyanContainer.style.animation = 'flyAcross 8s forwards';
    rainbow.style.animation = 'expandRainbow 8s forwards';
    
    // 添加音符
    addNotes();
    
    // 8秒後移除
    setTimeout(() => {
      if (document.body.contains(nyanContainer)) {
        document.body.removeChild(nyanContainer);
      }
    }, 8000);
    
    return '彩虹貓已啟動！';
  },
  
  'matrixEffect': () => {
    // 創建矩陣效果
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const columns = Math.floor(canvas.width / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    const matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 50);
    
    // 10秒後停止效果
    setTimeout(() => {
      clearInterval(matrixInterval);
      document.body.removeChild(canvas);
    }, 10000);
    
    return '矩陣效果已啟動！10秒後自動關閉';
  },
  
  'confettiParty': () => {
    // 創建五彩紙屑效果
    const confettiCount = 200;
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < confettiCount; i++) {
      createConfetti(confettiContainer, colors);
    }
    
    // 5秒後移除
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
    
    return '五彩紙屑效果已啟動！';
  }
};

// 創建單個紙屑
function createConfetti(container, colors) {
  const confetti = document.createElement('div');
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  confetti.style.position = 'absolute';
  confetti.style.width = `${Math.random() * 10 + 5}px`;
  confetti.style.height = `${Math.random() * 5 + 5}px`;
  confetti.style.backgroundColor = color;
  confetti.style.borderRadius = '2px';
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.top = '-5%';
  confetti.style.opacity = Math.random() + 0.5;
  confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
  
  container.appendChild(confetti);
  
  const animationDuration = Math.random() * 3 + 2;
  
  confetti.style.animation = `fall ${animationDuration}s linear forwards`;
  
  const keyframes = `
    @keyframes fall {
      to {
        top: 100%;
        transform: rotate(${Math.random() * 360 + 360}deg);
      }
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

// 將彩蛋命令添加到全局作用域中
const registerEasterEggs = () => {
  Object.keys(easterEggs).forEach(key => {
    window[key] = easterEggs[key];
  });
};

export default () => {
  // 在應用啟動時註冊彩蛋命令
  registerEasterEggs();
  
  // 在控制台輸出提示信息
  console.log('%cPL可視化網站已載入，在控制台輸入 hackCycuIce() 有驚喜！', 'color: orange; font-style: italic;');
}; 