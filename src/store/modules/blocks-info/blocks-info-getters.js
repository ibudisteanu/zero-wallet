export default {

    blocksInfoSorted: state => {
        const array = Object.values( state.listByHeight );
        return array.sort( (a,b)=>b.height.minus( a.height ) );
    }

}
