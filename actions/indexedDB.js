// IndexedDB utility for handling image storage and retrieval
class ImageDBManager {
  constructor() {
    this.dbName = "UserImagesDB";
    this.dbVersion = 1;
    this.storeName = "images";
    this.db = null;
  }

  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Error opening IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" });
          store.createIndex("userId", "userId", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  // Store image in IndexedDB
  async storeImage(userId, imageFile, imageType = "avatar") {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);

        // Create image record
        const imageRecord = {
          id: `${userId}_${imageType}_${Date.now()}`,
          userId: userId,
          type: imageType,
          file: imageFile,
          filename: imageFile.name,
          fileSize: imageFile.size,
          mimeType: imageFile.type,
          timestamp: new Date().toISOString(),
        };

        const request = store.put(imageRecord);

        request.onsuccess = () => {
          resolve(imageRecord.id);
        };

        request.onerror = () => {
          console.error("Error storing image:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in storeImage:", error);
      throw error;
    }
  }

  // Get image from IndexedDB
  async getImage(imageId) {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(imageId);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          console.error("Error getting image:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in getImage:", error);
      throw error;
    }
  }

  // Convert File to blob URL for display
  async getImageBlobUrl(imageId) {
    try {
      const imageRecord = await this.getImage(imageId);
      if (imageRecord && imageRecord.file) {
        return URL.createObjectURL(imageRecord.file);
      }
      return null;
    } catch (error) {
      console.error("Error creating blob URL:", error);
      return null;
    }
  }

  // Delete image from IndexedDB
  async deleteImage(imageId) {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(imageId);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = () => {
          console.error("Error deleting image:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in deleteImage:", error);
      throw error;
    }
  }

  // Delete all images for a user
  async deleteUserImages(userId) {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const index = store.index("userId");
        const request = index.getAll(userId);

        request.onsuccess = () => {
          const userImages = request.result;
          let deletePromises = userImages.map((img) => this.deleteImage(img.id));

          Promise.all(deletePromises)
            .then(() => resolve(true))
            .catch(reject);
        };

        request.onerror = () => {
          console.error("Error getting user images for deletion:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in deleteUserImages:", error);
      throw error;
    }
  }

  // Get all images for a user
  async getUserImages(userId) {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const index = store.index("userId");
        const request = index.getAll(userId);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.error("Error getting user images:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in getUserImages:", error);
      throw error;
    }
  }

  // Clear all images from IndexedDB
  async clearAllImages() {
    try {
      await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = () => {
          console.error("Error clearing images:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error in clearAllImages:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const imageDB = new ImageDBManager();
export default imageDB;
