# ImageApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**imageCreatePost**](#imagecreatepost) | **POST** /image/create | Create an image placeholder (metadata)|
|[**imageIdDelete**](#imageiddelete) | **DELETE** /image/{id} | Delete an image by ID|
|[**imageIdGet**](#imageidget) | **GET** /image/{id} | Get image details by ID|
|[**imageIdUploadPost**](#imageiduploadpost) | **POST** /image/{id}/upload | Upload binary file for an image ID (multipart)|
|[**imageMeGet**](#imagemeget) | **GET** /image/me | Get images for the authenticated user|

# **imageCreatePost**
> imageCreatePost()


### Example

```typescript
import {
    ImageApi,
    Configuration,
    ImageCreatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)
let body: ImageCreatePostRequest; //Image metadata to create (optional)

const { status, data } = await apiInstance.imageCreatePost(
    authorization,
    cookie,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **ImageCreatePostRequest**| Image metadata to create | |
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **cookie** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **imageIdDelete**
> imageIdDelete()


### Example

```typescript
import {
    ImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let id: string; //Image id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.imageIdDelete(
    id,
    authorization,
    cookie
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Image id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **cookie** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **imageIdGet**
> imageIdGet()


### Example

```typescript
import {
    ImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let id: string; //Image id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.imageIdGet(
    id,
    authorization,
    cookie
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Image id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **cookie** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **imageIdUploadPost**
> imageIdUploadPost()


### Example

```typescript
import {
    ImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let id: string; //Image id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)
let file: File; //Image file to upload (optional) (default to undefined)

const { status, data } = await apiInstance.imageIdUploadPost(
    id,
    authorization,
    cookie,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Image id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **cookie** | [**string**] |  | (optional) defaults to undefined|
| **file** | [**File**] | Image file to upload | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **imageMeGet**
> imageMeGet()


### Example

```typescript
import {
    ImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageApi(configuration);

let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.imageMeGet(
    authorization,
    cookie
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorization** | [**string**] |  | (optional) defaults to undefined|
| **cookie** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

