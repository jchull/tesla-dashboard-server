import {handleBodyRequestParsing, handleCompression, handleCors, handleLogging} from './common';

export default [handleLogging, handleCors, handleBodyRequestParsing, handleCompression];
