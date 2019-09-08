import {handleBodyRequestParsing, handleCompression, handleLogging, handleStatic, handleAuthentication} from './common';

export default [handleLogging, handleAuthentication, handleBodyRequestParsing, handleCompression, handleStatic];
