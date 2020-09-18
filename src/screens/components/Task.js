import React from 'react'
import {View, Text , StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swipeable  from  'react-native-gesture-handler/Swipeable'

import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../../commonStyles'




export default props => {

    const feitoOuNaoStyle = props.concluido != null ?
    {textDecorationLine: 'line-through'} : {}

    const date = props.concluido ? props.concluido : props.estimado
    const formatDate = moment(date).locale('pt-br')
      .format('ddd, D [de] MMMM')

      //retornar o conteudo que vai renderizar do lado direito
      const getRightContent =()=>{
          return (
              <TouchableOpacity style={styles.right} 
              onPress={() => props.onDelete && props.onDelete(props.id)}>
                  <Icon name="trash" size={30} color='#FFF' />
              </TouchableOpacity>
          ) 

      }

//retornar o conteudo que vai renderizar do lado esquerdo
      const getLeftContent =()=>{
        return (
            <View style={styles.left}>
                <Icon name="trash" size={20} color='#FFF' 
                 style={styles.excludeIcon} />
                <Text style={styles.excluirTexto}>Excluir</Text>
            </View>
        ) 

    }

    return (
        <Swipeable renderRightActions={getRightContent} 
        renderLeftActions={getLeftContent} onSwipeableLeftOpen={()=> props.onDelete && props.onDelete (props.id)}>
        <View style={styles.container}> 
        <TouchableWithoutFeedback  onPress={() => props.onToggleTask(props.id) }>
           
          <View style={styles.checkContainer}>
            {checarView(props.concluido)}
          </View>
        </TouchableWithoutFeedback>

        <View>

            <Text style={[styles.desc, feitoOuNaoStyle]}>{props.desc}</Text>
            <Text style={styles.date}>{formatDate}</Text>
            
            </View>
            
        </View>
        </Swipeable>
    )
}

function checarView (concluido){
    if(concluido !=  null){
        return (
            <View style={styles.feito}> 
            
               <Icon name='check' size={20} color='#FFF'></Icon>

            </View>
         )
    }else{
        return (
            <View style={styles.pedente}></View>
        )
  }
    
}

//estilo dos componentes na tela 
const styles = StyleSheet.create({
    container:{
        flexDirection : 'row',
        borderColor: '#AAA',
        borderBottomWidth:1,
        alignItems: 'center',
        paddingVertical:10,
        backgroundColor:'#FFF'

    },
    checkContainer:{
        width:'20%',
        alignItems: 'center',
        justifyContent:'center'
    },
    pedente:{
        height:25,
        width:25,
        borderRadius:13,
        borderWidth:1,
        borderColor:'#555'
    },
    feito: {
        height:25,
        width:25,
        borderRadius:13,
        backgroundColor:'#4D7031',
        alignItems:'center',
        justifyContent:'center'
    },
    desc:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize:15

    },
    date:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12

    },
    right:{
        backgroundColor: 'red',
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left:{
        flex: 1,
        backgroundColor: 'red',
        flexDirection:'row',
        alignItems: 'center',


    },
    excluirTexto:{
        fontFamily: commonStyles.fontFamily,
        color:'#FFF',
        fontSize:20,
        margin:10

    },
    excludeIcon:{
        marginLeft:10
    }
})