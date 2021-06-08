export default {

    blocksInfoSorted: state => {
        const array = Object.values( state.blocksInfo );
        return array.sort( (a,b)=>b.height - a.height );
    }

}
