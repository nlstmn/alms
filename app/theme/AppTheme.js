import Colors from './Colors';
const AppTheme = {
    colors: {
        primary: Colors.primary
    },
    fonts: {
        bold: "Montserrat-Bold",
        light: "Montserrat-Light",
        medium: "Montserrat-Medium",
        regular: "Montserrat-Regular"
    },
    activityTypeStyle: {
        backgroundColor: 'white',
        // borderRadius: 3,
        // margin: 10,
        marginBottom:5,
        marginTop:5,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    activityHtmlDescriptionBaseStyle: {
        fontSize: 15,
        fontFamily: "Montserrat-Medium",
        color:"black"
    }
}
export default AppTheme