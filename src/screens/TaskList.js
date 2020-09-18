import React,{Component} from 'react'
import {Alert,View, Text, ImageBackground , StyleSheet,FlatList , TouchableOpacity, Platform} from 'react-native'



import AsyncStorage from  "@react-native-community/async-storage"
//IMPORTANDO FOTO DE ASSETS
import todayImage from '../../assets/imgs/today.jpg'

import Icon from 'react-native-vector-icons/FontAwesome'

//IMPORTANDO FUNCAO PARA SABER QUE DIA E HOJE
import moment from 'moment'
import 'moment/locale/pt-br'

//IMPORTANDO ESTILO DE LETRAS E COR PARA AS MESMAS
import commonStyles from '../commonStyles.js'

//COMPONENTE DE DESCRICAO DAS TAREFAS
import Task from '../screens/components/Task'

//tela de adicionar
import AddTask from './AddTask'

const initialState = {
    mostrarTasks: true,
    showAddTask: false,
    visivelTask: [],
    tasks:[]    
}


export default class TaskList extends Component {

    // componente tasklist 
    state ={
        ...initialState 
    
    }
    
    componentDidMount = async () => {
       const stateString =  await AsyncStorage.getItem('tasksState')
       const state = JSON.parse(stateString) || initialState
       this.setState(state, this.filterTasks)
    }

     //filtrar 
    toggleFilter = ()=> {
        this.setState({ mostrarTasks: !this.state.mostrarTasks},this.filterTasks)
    }

    //filtrar task para mostrar na tela 
    filterTasks = () =>{
        let visivelTask = null
        if(this.state.mostrarTasks){
            visivelTask = [...this.state.tasks]
        }else{
            const pending = task => task.concluido === null
            visivelTask = this.state.tasks.filter(pending)
        }

        this.setState({ visivelTask})
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

  //altera estado de uma task se esta concluida ou não.
    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(tasks => {
            if(tasks.id === taskId){
                tasks.concluido = tasks.concluido ? null : new Date()
            }
        })

        this.setState({ tasks },this.filterTasks)

    }
     

    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'Descrição não informada!!')
            return 
         }

         const tasks = [...this.state.tasks]
         tasks.push({
             id: Math.random(),
             desc: newTask.desc,
             estimado: newTask.date,
             concluido: null
         })
       
         this.setState({tasks, showAddTask: false }, this.filterTasks)

    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks}, this.filterTasks)
    }


    render(){

        //CONSTANTE PARA DEFINIR O DIA 
        const dia = moment ().locale('pt-br').format('ddd,D [de] MMMM')

        //retornar componentes 
        return (
            <View style={styles.container}>

                <AddTask isVisible={this.state.showAddTask} onCancel={() => this.setState({ showAddTask: false}) } onSave={this.addTask} />
                
                <ImageBackground source={todayImage} style={styles.background}>

                    <View style={styles.iconBar}>
                      
                      <TouchableOpacity onPress={this.toggleFilter}>
                          <Icon name={this.state.mostrarTasks ? 'eye' :'eye-slash'}
                          size={20} color={commonStyles.colors.secondary} />
                      </TouchableOpacity>

                    </View>
                 <View style={styles.barradetitulo}>

                      <Text style={styles.titulo} >Hoje</Text>
                      <Text style={styles.subTitulo}>{dia}</Text>

                  </View>

                </ImageBackground>
                
                <View style={styles.teskList}>
                <FlatList data={this.state.visivelTask} keyExtractor={ item => `${item.id}` } 
                    renderItem={({item}) =><Task {...item}     onToggleTask={this.toggleTask} onDelete={this.deleteTask} /> } />
                
                </View>

                <TouchableOpacity style={styles.adicionarButton} activeOpacity={0.7}
                     onPress={()=> this.setState( {showAddTask: true})}>
                    <Icon  name="plus" size={20} color={ commonStyles.colors.secondary}/>
                </TouchableOpacity>
                
            </View>
        )
    }

}


//estilo dos componentes na tela 
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    background:{
        flex:3
    },
    teskList:{
        flex : 7

    },
    barradetitulo:{
        flex:1,
        justifyContent:'flex-end'
    },
    titulo:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft:20,
        marginBottom:20

    },
    subTitulo:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft:20,
        marginBottom:30
        
    },
    iconBar:{
        flexDirection:'row',
        marginHorizontal:20,
        justifyContent:'flex-end',
        marginTop: Platform.OS ==='ios' ? 40: 10

    },
    adicionarButton:{
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height:50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent:'center',
        alignItems: 'center'

    }
})