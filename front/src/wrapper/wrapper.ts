import * as API from '../generated/api';

function getApi() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pc_token') : null;
    const cfg = new API.Configuration({ basePath: (import.meta.env.VITE_API_BASE_URL as string) ?? undefined, baseOptions: { headers: token ? { authorization: `Bearer ${token}` } : {} } });
    return new API.DefaultApi(cfg);
}

function registerUser(username: string, password: string, email: string) {
    return getApi().userRegisterPost({ username, password, email } as any);
}

function loginUser(email: string, password: string) {
    return getApi().userLoginPost({ email, password } as any);
}

function createImage(title: string, description: string, url: string, collectionId?: string) {
    return getApi().imageCreatePost(undefined, { title, description, url, collectionId } as any);
}

function getImageById(id: string) {
    return getApi().imageIdGet(id);
}

function getMyImages() {
    return getApi().imageMeGet();
}

function listCollections() {
    return getApi().collectionGet();
}

function getCollectionById(id: string) {
    return getApi().collectionIdGet(id);
}

function deleteCollectionById(id: string) {
    return getApi().collectionIdDelete(id);
}

function putCollectionById(id: string, name: string, color: string) {
    return getApi().collectionIdPut(id, undefined, { name, color } as any);
}

function createCollection(name: string, color: string) {
    return getApi().collectionPost(undefined, {name, color} as any);
}

export {
    registerUser,
    loginUser,
    createImage,
    getImageById,
    listCollections,
    getMyImages,
    getCollectionById,
    deleteCollectionById,
    putCollectionById,
    createCollection
};