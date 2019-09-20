import {handleAuthentication, handleBodyRequestParsing, handleCompression, handleLogging, handleStatic} from './common';

export default [handleLogging, handleBodyRequestParsing, handleCompression, handleStatic, handleAuthentication];
