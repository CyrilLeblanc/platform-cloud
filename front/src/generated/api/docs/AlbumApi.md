# AlbumApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**albumGet**](#albumget) | **GET** /album/ | List albums visible to the caller|
|[**albumIdDelete**](#albumiddelete) | **DELETE** /album/{id} | Delete a album by ID|
|[**albumIdGet**](#albumidget) | **GET** /album/{id} | Get a album by its numeric ID|
|[**albumIdPut**](#albumidput) | **PUT** /album/{id} | Update a album by ID|
|[**albumPost**](#albumpost) | **POST** /album/ | Create a new album|

# **albumGet**
> albumGet()


### Example

```typescript
import {
    AlbumApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AlbumApi(configuration);

let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.albumGet(
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

# **albumIdDelete**
> albumIdDelete()


### Example

```typescript
import {
    AlbumApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AlbumApi(configuration);

let id: number; //Album id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.albumIdDelete(
    id,
    authorization,
    cookie
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Album id | defaults to undefined|
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
|**204** | No Content |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **albumIdGet**
> albumIdGet()


### Example

```typescript
import {
    AlbumApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AlbumApi(configuration);

let id: string; //Album id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.albumIdGet(
    id,
    authorization,
    cookie
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Album id | defaults to undefined|
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
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **albumIdPut**
> albumIdPut()


### Example

```typescript
import {
    AlbumApi,
    Configuration,
    AlbumPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AlbumApi(configuration);

let id: string; //Album id (default to undefined)
let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)
let body: AlbumPostRequest; //Album payload (optional)

const { status, data } = await apiInstance.albumIdPut(
    id,
    authorization,
    cookie,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **AlbumPostRequest**| Album payload | |
| **id** | [**string**] | Album id | defaults to undefined|
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
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **albumPost**
> albumPost()


### Example

```typescript
import {
    AlbumApi,
    Configuration,
    AlbumPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AlbumApi(configuration);

let authorization: string; // (optional) (default to undefined)
let cookie: string; // (optional) (default to undefined)
let body: AlbumPostRequest; //Album payload (optional)

const { status, data } = await apiInstance.albumPost(
    authorization,
    cookie,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **AlbumPostRequest**| Album payload | |
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

