export default {

    blocksInfoSorted: state => {

        const array = Object.values( state.blocksInfo );
        console.log("array", array);;
        return array.sort( (a,b)=>b.height - a.height );
    }

}