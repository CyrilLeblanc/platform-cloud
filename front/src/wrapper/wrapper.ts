import * as API from '../generated/api';

let DefaultApi = new API.DefaultApi();

function registerUser(username: string, password: string, email: string) {
    return DefaultApi.userRegisterPost({ username, password, email } as any);
}

function loginUser(email: string, password: string) {
    return DefaultApi.userLoginPost({ email, password } as any);
}

function createImage(title: string, description: string, url: string, collectionId?: string) {
    return DefaultApi.imageCreatePost({ title, description, url, collectionId } as any);
}

function getImageById(id: string) {
    return DefaultApi.imageIdGet(id);
}

function getMyImages() {
    return DefaultApi.imageMeGet();
}

function getCollectionById(id: string) {
    return DefaultApi.collectionIdGet(id);
}

function deleteCollectionById(id: string) {
    return DefaultApi.collectionIdDelete(id);
}

function putCollectionById(id: string, name: string, color: string) {
    return DefaultApi.collectionIdPut(id, { name, color } as any);
}

function createCollection(name: string, color: string) {
    return DefaultApi.collectionPost({ name, color } as any);
}

export {
    registerUser,
    loginUser,
    createImage,
    getImageById,
    getMyImages,
    getCollectionById,
    deleteCollectionById,
    putCollectionById,
    createCollection
};