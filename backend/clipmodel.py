import abc

import torch
import clip
import numpy as np

from PIL import Image

from numbers import Number
from typing import List

import open_clip
import torch
from typing import List
from PIL import Image

class EmbedderOpenCLIP():
    def __init__(self, clip_model_name='ViT-H-14', device='cpu', pretrained = 'laion400m_e32'):
        self.device = device
        self.predictor, _, self.preprocess = open_clip.create_model_and_transforms(clip_model_name, pretrained, device=self.device)

    def _tonumpy(self, tensor: torch.Tensor) -> np.ndarray:
        return tensor.cpu().detach().numpy()

    def encode_text(self, text: str) -> np.ndarray:
        with torch.no_grad():
            text = open_clip.tokenize(text)
            text_features = self.predictor.encode_text(text.to(self.device))
            text_features /= text_features.norm(dim=-1, keepdim=True)
        return self._tonumpy(text_features)

    def encode_imgs(self, pil_imgs: List[Image.Image]) -> np.ndarray:
        #image = preprocess(Image.open("CLIP.png")).unsqueeze(0)
        imgs_preprocessed = torch.stack([self.preprocess(photo) for photo in pil_imgs]).to(self.device)

        with torch.no_grad():
            image_features = self.predictor.encode_image(imgs_preprocessed)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            return self._tonumpy(image_features)

class EmbedderCLIP():
    def __init__(self, clip_model_name='ViT-B/32', device='cpu'):
        """
        :param clip_model_name:
        :param device:
        """
        self.device = device
        self.predictor, self.preprocess = clip.load(clip_model_name, device=device)

    def _tonumpy(self, tensor: torch.Tensor) -> np.ndarray:
        """
        Detaches tensor from GPU and converts it to numpy array
        :return: numpy array
        """
        return tensor.cpu().detach().numpy()

    def encode_text(self, text: str) -> np.ndarray:
        """
        Returns text latent of the text input
        :param text:
        :return:
        """
        with torch.no_grad():
          # Encode it to a feature vector using CLIP
          text_latent = self.predictor.encode_text(clip.tokenize(text).to(self.device))
          text_latent /= text_latent.norm(dim=-1, keepdim=True)
          
        return self._tonumpy(text_latent)

    def encode_imgs(self, pil_imgs: List[Image.Image]) -> np.ndarray:
        """
        Returns image latents of a image batch
        :param pil_imgs: list of PIL images
        :return img_latents: numpy array of img latents
        """

        # Preprocess all photos
        photos_preprocessed = torch.stack([self.preprocess(photo) for photo in pil_imgs]).to(self.device)

        with torch.no_grad():
          # Encode the photos batch to compute the feature vectors and normalize them
          img_latents = self.predictor.encode_image(photos_preprocessed)
          img_latents /= img_latents.norm(dim=-1, keepdim=True)

        return self._tonumpy(img_latents)
