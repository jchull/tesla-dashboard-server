import {handleBodyRequestParsing, handleCompression, handleLogging, handleStatic, handleAuthentication} from './common';

export default [handleLogging, handleBodyRequestParsing, handleCompression, handleStatic, handleAuthentication];
