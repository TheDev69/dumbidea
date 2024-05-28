document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const walletInfo = document.getElementById('wallet-info');
    const connectWalletButton = document.getElementById('connect-wallet-button');
    let cropper;
    let walletConnected = false;

    const pages = {
        home: `
            <h1>Home Page</h1>
            <p>Welcome to the Home Page.</p>
        `,
        profile: `
            <div id="profile-page" class="page">
                <div class="top-bar">
                    <div class="portfolio-value">Portfolio Value: 0.136</div>
                    <div class="cards">Cards: 6</div>
                    <div class="food">Food: 220</div>
                    <div class="eth">ETH: 0.071</div>
                </div>
                <div class="profile-container">
                    <div class="filters">
                        <div class="filter-section">
                            <h2>Basic Attributes</h2>
                            <label><input type="checkbox" name="breed"> Breed</label>
                            <label><input type="checkbox" name="colour"> Colour</label>
                            <label><input type="checkbox" name="size"> Size</label>
                            <label><input type="checkbox" name="pose"> Pose</label>
                            <label><input type="checkbox" name="demeanor"> Demeanor</label>
                            <label><input type="checkbox" name="background"> Background</label>
                        </div>
                        <div class="filter-section">
                            <h2>Gaming Attributes</h2>
                            <label><input type="checkbox" name="cuteness"> Cuteness</label>
                            <label><input type="checkbox" name="temperament"> Temperament</label>
                            <label><input type="checkbox" name="intelligence"> Intelligence</label>
                            <label><input type="checkbox" name="speed"> Speed</label>
                            <label><input type="checkbox" name="loyalty"> Loyalty</label>
                            <label><input type="checkbox" name="energy"> Energy Level</label>
                        </div>
                    </div>
                    <div class="nft-cards">
                        ${Array.from({ length: 30 }, (_, i) => `
                            <div class="nft-card">
                                <img src="placeholder.png" alt="NFT ${i + 1}">
                                <p>NFT ${i + 1}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `,
        marketplace: `
            <div id="marketplace-page" class="page">
                <div class="top-bar">
                    <div class="portfolio-value">Portfolio Value: 0.136</div>
                    <div class="cards">Cards: 6</div>
                    <div class="food">Food: 220</div>
                    <div class="eth">ETH: 0.071</div>
                </div>
                <div class="marketplace-container">
                    <div class="filters">
                        <div class="filter-section">
                            <h2>Basic Attributes</h2>
                            <label><input type="checkbox" name="breed"> Breed</label>
                            <label><input type="checkbox" name="colour"> Colour</label>
                            <label><input type="checkbox" name="size"> Size</label>
                            <label><input type="checkbox" name="pose"> Pose</label>
                            <label><input type="checkbox" name="demeanor"> Demeanor</label>
                            <label><input type="checkbox" name="background"> Background</label>
                        </div>
                        <div class="filter-section">
                            <h2>Gaming Attributes</h2>
                            <label><input type="checkbox" name="cuteness"> Cuteness</label>
                            <label><input type="checkbox" name="temperament"> Temperament</label>
                            <label><input type="checkbox" name="intelligence"> Intelligence</label>
                            <label><input type="checkbox" name="speed"> Speed</label>
                            <label><input type="checkbox" name="loyalty"> Loyalty</label>
                            <label><input type="checkbox" name="energy"> Energy Level</label>
                        </div>
                    </div>
                    <div class="nft-cards">
                        ${Array.from({ length: 30 }, (_, i) => `
                            <div class="nft-card">
                                <img src="placeholder.png" alt="NFT ${i + 1}">
                                <p>NFT ${i + 1}</p>
                                <button class="buy-now">Buy 0.01 ETH</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `,
        rewards: `
            <h1>Rewards Page</h1>
            <p>Welcome to the Rewards Page.</p>
        `,
        referrals: `
            <h1>Referrals Page</h1>
            <p>Welcome to the Referrals Page.</p>
        `,
        mint: `
            <div class="mint-container">
                <div class="upload-box">
                    <img id="uploaded-image" style="display:none; max-width: 100%; max-height: 100%;" />
                </div>
                <div class="mint-actions">
                    <input type="file" id="upload-input" hidden>
                    <button id="upload-button">Upload Picture</button>
                    <button id="crop-picture-button" hidden>Crop Picture</button>
                    <p id="placeholder-message" hidden>Picture is a dog - Mint now!</p>
                    <button id="mint-pet-button" class="disabled">Mint Pet</button>
                </div>
            </div>
        `
    };

    function loadPage(page) {
        content.innerHTML = pages[page];
        if (page === 'mint') {
            setupMintPage();
        }
    }

    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Load the default page
    loadPage('home');

    // Wallet Connection Logic
    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];

                // Placeholder values for ETH and FOOD balances
                const ethBalance = '0.21';
                const foodTokenBalance = '19,200';
                const shortAccount = `${account.slice(0, 4)}....${account.slice(-4)}`;

                walletInfo.innerHTML = `
                    <div><i class="fab fa-ethereum"></i> ${ethBalance}</div>
                    <div><img src="images/food1.png" alt="Food Token" class="token-icon"> ${foodTokenBalance}</div>
                    <div>${shortAccount}</div>
                `;

                walletConnected = true;
                checkMintPetButtonState();
            } catch (error) {
                console.error('Error connecting to wallet', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    connectWalletButton.addEventListener('click', connectWallet);

    function setupMintPage() {
        const mintPetButton = document.getElementById('mint-pet-button');
        const uploadButton = document.getElementById('upload-button');
        const uploadInput = document.getElementById('upload-input');
        const cropPictureButton = document.getElementById('crop-picture-button');
        const placeholderMessage = document.getElementById('placeholder-message');
        const uploadedImage = document.getElementById('uploaded-image');

        uploadButton.onclick = () => uploadInput.click();

        uploadInput.onchange = () => {
            const file = uploadInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    uploadedImage.src = e.target.result;
                    uploadedImage.style.display = 'block';

                    // Initialize Cropper.js
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(uploadedImage, {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 1
                    });

                    cropPictureButton.hidden = false;
                };
                reader.readAsDataURL(file);
            }
        };

        cropPictureButton.onclick = () => {
            const croppedCanvas = cropper.getCroppedCanvas();
            placeholderMessage.hidden = false;
            mintPetButton.classList.remove('disabled');
            checkMintPetButtonState();
        };

        mintPetButton.onclick = () => {
            if (!mintPetButton.classList.contains('disabled')) {
                alert('Transaction signed! Minting NFT...');
                // Placeholder for minting logic
                placeholderMessage.innerHTML = 'NFT minted successfully!';
            }
        };
    }

    function checkMintPetButtonState() {
        const mintPetButton = document.getElementById('mint-pet-button');
        if (walletConnected && !mintPetButton.classList.contains('disabled')) {
            mintPetButton.classList.remove('disabled');
        } else {
            mintPetButton.classList.add('disabled');
        }
    }
});
