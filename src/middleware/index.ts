import {handleLogging, handleBodyRequestParsing, handleCompression, handleCors} from './common';

export default [handleLogging, handleCors, handleBodyRequestParsing, handleCompression];
