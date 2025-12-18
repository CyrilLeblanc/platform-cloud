import * as API from '../generated/api';

function getApi() {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('pc_token')
            : null;

    const cfg = new API.Configuration({
        basePath: (import.meta.env.VITE_API_BASE_URL as string) ?? undefined,
        baseOptions: {
            withCredentials: true, // 👈 équivalent à credentials: 'include'
            headers: token
                ? { authorization: `Bearer ${token}` }
                : {},
        },
    });

    const userApi = API.UserApiFactory(cfg);
    const imageApi = API.ImageApiFactory(cfg);
    const albumApi = API.AlbumApiFactory(cfg);

    return {
        userRegisterPost: userApi.userRegisterPost.bind(userApi),
        userLoginPost: userApi.userLoginPost.bind(userApi),
        userMeGet: userApi.userMeGet.bind(userApi),
        imageCreatePost: imageApi.imageCreatePost.bind(imageApi),
        imageIdGet: imageApi.imageIdGet.bind(imageApi),
        imageIdDelete: imageApi.imageIdDelete.bind(imageApi),
        imageIdUploadPost: imageApi.imageIdUploadPost.bind(imageApi),
        imageMeGet: imageApi.imageMeGet.bind(imageApi),
        albumGet: albumApi.albumGet.bind(albumApi),
        albumIdGet: albumApi.albumIdGet.bind(albumApi),
        albumIdDelete: albumApi.albumIdDelete.bind(albumApi),
        albumIdPut: albumApi.albumIdPut.bind(albumApi),
        albumPost: albumApi.albumPost.bind(albumApi),
    };
}

function registerUser(username: string, password: string, email: string) {
    return getApi().userRegisterPost({ username, password, email } as any);
}

function loginUser(email: string, password: string) {
    return getApi().userLoginPost({ email, password } as any);
}

function uploadImage(id: string, file: File) {
    return getApi().imageIdUploadPost(id, undefined, undefined, file);
}

function createImage(title: string, description: string, url: string, collectionId?: string) {
    return getApi().imageCreatePost(undefined, { title, description, url, collectionId } as any);
}

function getImageById(id: string) {
    return getApi().imageIdGet(id);
}

function deleteImage(id: string) {
    return (getApi() as any).imageIdDelete(id);
}

function getMyImages() {
    return getApi().imageMeGet();
}

function listCollections() {
    return getApi().albumGet();
}

function getCollectionById(id: string) {
    return getApi().albumIdGet(id);
}

function deleteCollectionById(id: string) {
    return getApi().albumIdDelete(parseInt(id));
}

function putCollectionById(id: string, name: string, color: string) {
    return getApi().albumIdPut(id, undefined, { name, color } as any);
}

function createCollection(name: string, color: string) {
    return getApi().albumPost(undefined, undefined, {name, color} as any);
}

export {
    registerUser,
    loginUser,
    createImage,
    uploadImage,
    getImageById,
    deleteImage,
    listCollections,
    getMyImages,
    getCollectionById,
    deleteCollectionById,
    putCollectionById,
    createCollection
};