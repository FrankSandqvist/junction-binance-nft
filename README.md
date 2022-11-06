# Snoop Doge - NFT search engine 

---
### Screencast:
![screencast](https://user-images.githubusercontent.com/90638222/200160205-3d15472b-c626-4528-a64b-1b7845415e40.gif)


Snoop Doge is a real-time search indexing solution where users can find NFTs using image or text. The data is pre-processed on a variety of image and text pairs with [CLIP, a pre-trained neural network](https://github.com/mlfoundations/open_clip). We perform instant search among nearly ten thousand (and counting) NFTs across multiple platforms.
To make it work, we have indexed a [Binance](https://www.binance.com/en/nft/home) and [NFT Showroom](https://nftshowroom.com/) websites.

![](https://github.com/FrankSandqvist/junction-binance-nft/blob/main/assets/nft-snoopdoge.001.jpeg)

---
### About:
#### Problem:
The product addresses the need for effective real-time NFT search and indexing. The NFT industry is projected to grow up to twenty-fold in the next ten years. Users will want to find NFTs based on their everyday interests and environments. The market needs to create user-friendly and smart tools to prepare for and facilitate the upcoming mainstream adoption of NFTs, and that is what we are aiming to do.  

#### Solution:
Snoop Doge is a real-time search indexing solution where users can easily find NFTs using images and text. The tool has indexed and can search nearly ten thousand (and counting) NFTs across multiple platforms. Users can upload camera images, which are instantly recognised as search input. They can also use textual input either as an alternative or to further specify their exact search criteria. They are also able to click on existing results to get similar NFTs, further narrowing down their queries and increasing output relevance.

#### Technical Details:
![](https://github.com/FrankSandqvist/junction-binance-nft/blob/main/assets/nft-snoopdoge.002.jpeg)
The data is pre-processed on a variety of image and text pairs with CLIP (Contrastive Language-Image Pre-Training), a pre-trained neural network. The model returns an embedding vector for each image or text string, and this vector can be compared with the pre-processed vectors in the database to find top-n similar items. We provide more accurate results and do not rely on heavy GPU setup, hence reducing the cost. Our response time averages between 100-200 ms per query on our modest 8-core standard cloud instance. The tool is easily scalable through the extension of the search database up to a couple million images. The use of the approximate nearest neighbors guarantees excellent search times as we scale. Our search engine can be further improved by reducing the size of the generated vectors, improvement of the Clip model image cropping area, and integrating the previous user search and NFT purchase behaviour. 
* [mlfoundations/open_clip](https://github.com/mlfoundations/open_clip) - Open source implementation of OpenAI's CLIP  - ViT-B/16+ pre-trained on LAION-400M was used for this project.
---
### Demo Link
The tool is available online and can be tested out by anyone at https://bit.ly/snoopdogenft

![](https://github.com/FrankSandqvist/junction-binance-nft/blob/main/assets/nft-snoopdoge.003.jpeg)

---
### And you can run it by yourself:

#### To run the frontend:

* `npm install`
* `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### To run the backend:

* `pip install -r requirements.txt` - you will need to install the plugins:  
* `python main.py` - And start the server:

---

### Team:
- [Vladimir Kiliazov](https://github.com/vladimirwest)

- [Andrew Trofimov](https://github.com/AnyTrofi)

- [Frank Sandqvist](https://github.com/FrankSandqvist)

- Linas Vastakas(linas.vastakas@gmail.com)

- Habib Ahmed(ihaabi@gmail.com)





