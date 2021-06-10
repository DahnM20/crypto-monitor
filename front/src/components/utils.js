function compareAsset( a, b ) {
    if ( a.currentValue < b.currentValue ){
      return 1;
    }
    if ( a.currentValue > b.currentValue ){
      return -1;
    }
    return 0;
  }

export { compareAsset }