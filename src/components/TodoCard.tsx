import React from 'react';
import {
  compose,
  AnyAction,
  Dispatch,
} from 'redux';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
  Record,
  List,
} from 'immutable';
import {
  ITodo,
  CompletedTodoAction,
  AddSubTodoAction,
  SubTodoFactory,
  ISubTodo,
  DeleteTodoAction,
  CompleteSubTodoAction,
  SelectTodoAction,
} from '../actions/default';
import {
  Checkbox,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';
import {
  connect,
} from 'react-redux';
import {
  createStructuredSelector,
} from 'reselect';
import {
  makeSelectSubTodosForTodo, makeSelectSelectedTodoId,
} from '../selectors/default';
import classnames from 'classnames';
import { reduxForm, Field, Form } from 'redux-form';
import FieldTextField from './FieldTextField';
import { InjectedFormProps } from 'redux-form';

interface ITodoCardComponentProps {
  todo: Record<ITodo>;
}

interface ITodoCardProps extends ITodoCardComponentProps {
  dispatch: Dispatch<AnyAction>;
  todoId: number;
  complete: boolean;
  subtodos: List<Record<ISubTodo>>;
  selectedTodoId: number;
}

const useStyles = makeStyles({
  card: {
    margin: 4,
    maxWidth: 345,
  },
  cardSelected: {
    backgroundColor: 'lightgrey',
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subtodoContainer: {
    paddingLeft: '1em',
  }
});

interface Values extends Partial<ISubTodo> {
}

const TodoCard: React.FC<ITodoCardProps & InjectedFormProps> = (props) => {
  const classes = useStyles();
  const {
    todo,
    todoId,
    complete,
    subtodos,
    dispatch,
    selectedTodoId,

    reset,
    handleSubmit,
  } = props;


  // (values: Record<Values>) but handleSubmit is typed wrong
  const onSubmit = (values: any) => {
    dispatch(new AddSubTodoAction({
      todoId,
      subTodo: SubTodoFactory(values)
    }));
    reset()
  }

  function getValues(values:any) {
    var arrayValues = [];
    var count=0;
    var list = todo.get('title');
    arrayValues.push(values.get('value1').trim());
    arrayValues.push(values.get('value2').trim());
    arrayValues.push(values.get('value3').trim());
    arrayValues.push(values.get('value4').trim());
    console.log("Before",arrayValues, arrayValues.length );
   for(var i=0; i<arrayValues.length; i++)
   {
    console.log(arrayValues[i]);
    if ( arrayValues[i] ==='') {
      count++;
      arrayValues.splice(i, 1); 
    }
   }

   for(var j=0; j<arrayValues.length; j++)
   {
    if ( arrayValues[j] ==='') {
      count++;
      arrayValues.splice(j, 1); 
    }
   }

   for(var k=0; k<arrayValues.length; k++)
   {
    if ( arrayValues[k] ==='') {
      count++;
      arrayValues.splice(k, 1); 
    }
   }
   
   console.log("After",arrayValues,count);
   for(var l=0; l<arrayValues.length; l++)
   {
     list= list +"; "+arrayValues[l]; 
   }
   return list;
    // if (values.get('value1') === '') {
    //   return  todo.get('title')+ '; ' + todo.get('value2')+'; '+ todo.get('value3') +'; ' +todo.get('value4')
    // } else if (values.get('value2') === '') {
    //   return "value 2 empty"
    // }  else if (values.get('value3') === '') {
    //   return "value 3 empty"
    // }  else if (values.get('value4') === '') {
    //   return "value 4 empty"
    // }
  }
  

  return (
    <Form<Record<Values>> onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent
            classes={{
              root: classnames({[classes.cardSelected]: selectedTodoId === todoId})
            }}
            onClick={() => {
              dispatch(new SelectTodoAction({todoId}))
            }}
          >
            <Grid
              container={true}
            >
              <Grid
                container={true}
                item={true}
                alignItems='center'
                wrap='nowrap'
              >
                <Checkbox
                  checked={complete}
                  value={complete}
                  onChange={() => {
                    dispatch(new CompletedTodoAction({ todo, complete }))
                  }}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  classes={{
                    root: complete ? classes.completed : '',
                  }}
                >
                 
                 {getValues(todo)}
                </Typography>
              </Grid>
              <Grid
                container={true}
                item={true}
                direction='column'
                classes={{
                  item: classes.subtodoContainer,
                }}
              >
                {
                  subtodos.map((subtodo) => {
                    const subtodoId = subtodo.get('id');
                    const subComplete = subtodo.get('complete');
                    return <Grid
                      key={subtodoId}
                      container={true}
                      item={true}
                      alignItems='center'
                      wrap='nowrap'
                    >
                      <Checkbox
                        checked={subComplete}
                        value={subComplete}
                        onChange={() => {
                          dispatch(new CompleteSubTodoAction({ subtodo, complete: subComplete }))
                        }}
                        inputProps={{
                          'aria-label': 'primary checkbox',
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        classes={{
                          root: subComplete ? classes.completed : '',
                        }}
                      >
                        {subtodo.get('title')}
                      </Typography>
                    </Grid>
                  })
                }
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small" 
            color="primary" 
            //@ts-ignore   
            onClick={() => {
              dispatch(new DeleteTodoAction({ todo }));
            }}
          >
            Delete
          </Button>
          <Field
            TextFieldProps={{
              label: 'title',
            }}
            name='title'
            component={FieldTextField}
          />
          <Button 
            size="small" 
            color="primary"
            type="submit"
          >
            {"Add SubTodo"}
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}

const mapStateToProps = (state: any, ownProps: ITodoCardComponentProps) => {
  const {
    todo
  } = ownProps;
  const todoId = todo.get('id');
  const complete = todo.get('complete');
  const form = `form_${todoId}`;
  return {
    form,
    todoId,
    complete,
    ...createStructuredSelector({
      selectedTodoId: makeSelectSelectedTodoId(),
      subtodos: makeSelectSubTodosForTodo(todoId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    dispatch,
  };
};

export default compose<React.ComponentClass<ITodoCardComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: true,
  }),
)(TodoCard);