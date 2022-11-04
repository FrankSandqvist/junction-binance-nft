#import config
import os
from flask_cors import CORS, cross_origin
import urllib
import urllib.request
import json
import numpy as np
import os
import cv2
from flask import Flask, request, render_template, send_file
from clipmodel import EmbedderCLIP
from indexer import Indexer

clip_embedder = EmbedderCLIP()

app = Flask(__name__)
indexer = Indexer()
indexer.load(filename)

@app.route('/search_by_image', methods=['POST'])
@cross_origin()
def search_by_image():
    image_undecoded = request.get_data()
    img = cv2.imdecode(np.frombuffer(image_undecoded, np.uint8), -1)
    emb = clip_embedder.encode_imgs(img)
    dists, indexes = indexer.find(emb)
    return dists, indexes
    
    
@app.route('/search_by_prompt', methods=['POST'])
@cross_origin()
def search_by_prompt():
    prompt = request.args.get('prompt')
    emb = clip_embedder.encode_text(prompt)
    dists, indexes = indexer.find(emb)
    return dists, indexes
    

if __name__ == '__main__':
    print("Starting server on port 5000")
    app.run(host="0.0.0.0", port=5000)
    
    
    
    