const newData=[
    {
        'id': 'You can see relationships between parts',
        'name': 'SE1',
        'link_positive': [{'IA1': 0.7}, {'IA2': 0.7}, {'VE1': 0.8}, {'VE5': 0.8}],
        'link_negative': [{'VE4': -0.6}, {'VE2': -0.7}, {'VE3': -0.7}, {'SE2': -0.9}]
      },
      {
        'id': 'You can change your mind easily',
        'name': 'SE2',
        'link_positive': [],
        'link_negative': [{'SE1': -0.9}]
      },
      {
        'id': 'There are routes from a thing you know to something you don\'t',
        'name': 'SE3',
        'link_positive': [{'SE1': 0.8}, {'ME3': 0.7}, {'TE1': 0.6}, {'IE3': 0.7}, {'ME5': 0.6}],
        'link_negative': []
      },
      {
        'id': 'You can compare or contrast different parts',
        'name': 'SE4',
        'link_positive': [{'VE1': 0.8}, {'VE5': 0.8}, {'ME3': 0.7}, {'ME4': 0.7}, {'TE2': 0.6}],
        'link_negative': []
      },
      
      {
        'id': 'The information you need is visible',
        'name': 'VE1',
        'link_positive': [{'VE4': 0.9}],
        'link_negative': []
      },
      {
        'id': 'The overall story is clear',
        'name': 'VE2',
        'link_positive': [{'VE1': 0.9}, {'SE1': 0.8}],
        'link_negative': [{'VE5': -0.7}]
      },
      {
        'id': 'Important parts draw your attention',
        'name': 'VE3',
        'link_positive': [{'ME2': 0.8}, {'IE6': 0.8}, {'CE2': 0.8}],
        'link_negative': []
      },
      {
  'id': 'The visual layout is concise',
  'name': 'VE4',
  'link_positive': [{'SE1': 0.5}],
  'link_negative': [{'ME5': -0.7}, {'IE3': -0.7}, {'IE4': -0.6}, {'ME1': -0.8}, {'TE4': -0.8}]
},
 {
  'id': 'You can see detail in context',
  'name': 'VE5',
  'link_positive': [{'VE1': 0.9}, {'VE2': 0.9}, {'VE3': 0.9}, {'VE4': 0.9}],
  'link_negative': [{'IE1': -0.6}, {'IE2': -0.6}, {'IE3': -0.6}]
},
{
  'id': 'It looks like what it describes',
  'name': 'ME1',
  'link_positive': [{'TE4': 0.7}],
  'link_negative': [{'VE4': -0.8}, {'ME4': -0.6}, {'CE2': -0.7}, {'CE3': -0.7}]
},
{
  'id': 'The purpose of each part is clear',
  'name': 'ME2',
  'link_positive': [{'ME1': 0.8}, {'PE2': 0.7}, {'VE3': 0.9}],
  'link_negative': []
},
{
  'id': 'Similar things look similar',
  'name': 'ME3',
  'link_positive': [{'SE4': 0.9}, {'VE2': 0.8}, {'VE3': 0.8}, {'ME2': 0.8}],
  'link_negative': [{'ME4': -0.7}]
},
{
  'id': 'You can tell the difference between things',
  'name': 'ME4',
  'link_positive': [{'IE4': 0.8}, {'VE3': 0.7}, {'SE4': 0.7}],
  'link_negative': [{'CE3': -0.6}, {'TE3': -0.5}]
},
{
  'id': 'You can add comments',
  'name': 'ME5',
  'link_positive': [{'CE1': 0.8}, {'CE4': 0.8}, {'IE3': 0.7}, {'TE1': 0.7}],
  'link_negative': []
},
{
  'id': 'The visual connotations are appropriate',
  'name': 'ME6',
  'link_positive': [{'VE2': 0.7}, {'ME1': 0.8}, {'TE5': 0.6}, {'CE4': 0.6}],
  'link_negative': []
},
{
  'id': 'Interaction opportunities are evident',
  'name': 'IE1',
  'link_positive': [{'ME1': 0.7}, {'ME2': 0.7}, {'ME6': 0.6}, {'TE4': 0.9}, {'PE2': 0.8}],
  'link_negative': [{'CE2': -0.6}, {'CE3': -0.6}, {'ME6': -0.5}, {'TE5': -0.7}]
},
{
  'id': 'Actions are fluid, not awkward',
  'name': 'IE2',
  'link_positive': [],
  'link_negative': [{'SE2': -0.9}, {'IE3': -0.8}, {'IE4': -0.8}]
},
{
  'id': 'Things stay where you put them',
  'name': 'IE3',
  'link_positive': [{'VE1': 0.7}, {'VE2': 0.7}, {'VE4': 0.7}, {'SE1': 0.8}, {'SE2': 0.8}, {'SE4': 0.8}, {'TE2': 0.7}, {'IE5': 0.8}],
  'link_negative': [{'TE1': -0.8}, {'ME2': -0.7}, {'IE4': -0.9}, {'ME5': -0.7}]
},
{
  'id': 'Accidental mistakes are unlikely',
  'name': 'IE4',
  'link_positive': [{'TE1': 0.7}, {'TE2': 0.7}, {'TE4': 0.8}, {'VE2': 0.7}, {'VE3': 0.7}, {'SE3': 0.8}, {'ME2': 0.8}, {'ME3': 0.7}, {'ME4': 0.8}],
  'link_negative': [{'SE2': -0.9}, {'ME5': -0.8}, {'IE2': -0.8}, {'IE3': -0.8}, {'PE3': -0.7}, {'PE4': -0.7}, {'CE2': -0.7}, {'CE4': -0.7}]
},
{
  'id': 'Easier actions steer what you do',
  'name': 'IE5',
  'link_positive': [{'IE1': 0.8}, {'SE3': 0.8}, {'VE3': 0.7}, {'PE1': 0.7}],
  'link_negative': [{'CE2': -0.7}, {'SE2': -0.8}, {'ME5': -0.8}, {'TE3': -0.6}]
},
{
  'id': 'It is easy to refer to specific parts',
  'name': 'IE6',
  'link_positive': [{'ME1': 0.7}, {'ME4': 0.7}, {'IE3': 0.8}, {'ME5': 0.8}],
  'link_negative': [{'SA2': -0.8}, {'SE4': -0.7}, {'TE1': -0.7}, {'VE4': -0.7}, {'PE5': -0.9}]
},
{
  'id': 'You don’t need to think too hard',
  'name': 'TE1',
  'link_positive': [{'VE1': 0.8}, {'VE4': 0.8}, {'SE1': 0.7}, {'SE3': 0.7}, {'SE4': 0.7}, {'PE1': 0.8}, {'PE2': 0.8}, {'VE3': 0.7}, {'ME1': 0.7}, {'ME2': 0.7}, {'IE6': 0.8}, {'VE5': 0.7}, {'ME5': 0.7}],
  'link_negative': [{'TE3': -0.9}]
},
{
  'id': 'You can read-off new information',
  'name': 'TE2',
  'link_positive': [{'VE3': 0.8}, {'VE5': 0.8}, {'SE1': 0.7}, {'SE3': 0.7}, {'IE5': 0.7}],
  'link_negative': [{'ME1': -0.6}, {'ME6': -0.6}, {'CE3': -0.6}]
},
{
  'id': 'It makes you stop and think',
  'name': 'TE3',
  'link_positive': [{'SE1': 0.7}, {'ME2': 0.7}, {'TE2': 0.7}],
  'link_negative': [{'TE1': -0.9}, {'TE5': -0.8}]
},
{
  'id': 'Elements mean only one thing',
  'name': 'TE4',
  'link_positive': [{'ME1': 0.8}, {'PE2': 0.8}],
  'link_negative': [{'CE1': -0.7}, {'CE2': -0.7}, {'CE3': -0.7}]
},
{
  'id': 'You are drawn in to play around',
  'name': 'TE5',
  'link_positive': [{'IE2': 0.8}, {'IE4': 0.8}, {'PE3': 0.7}, {'PE4': 0.7}, {'SE2': 0.7}, {'IE3': 0.7}, {'CE3': 0.8}, {'CE4': 0.8}],
  'link_negative': [{'TE3': -0.8}]
},
{
  'id': 'The order of tasks is natural',
  'name': 'PE1',
  'link_positive': [{'IE2': 0.7}, {'IE5': 0.7}, {'TE5': 0.7}, {'SE4': 0.6}, {'CE1': 0.7}],
  'link_negative': []
},
{
  'id': 'The steps you take match your goals',
  'name': 'PE2',
  'link_positive': [{'ME2': 0.8}, {'VE5': 0.7}],
  'link_negative': [{'ME5': -0.7}, {'TE4': -0.7}, {'CE2': -0.7}]
},
{
  'id': 'You can try out a partial product',
  'name': 'PE3',
  'link_positive': [{'IE2': 0.7}, {'TE5': 0.7}, {'PE4': 0.7}, {'ME5': 0.7}],
  'link_negative': []
},
{
  'id': 'You can be non-committal',
  'name': 'PE4',
  'link_positive': [{'PE6': 0.7}, {'ME5': 0.6}],
  'link_negative': []
},
{
  'id': 'Repetition can be automated',
  'name': 'PE5',
  'link_positive': [{'PE2': 0.7}, {'CE1': 0.7}],
  'link_negative': [{'SE2': -0.7}, {'SE1': -0.6}, {'IE4': -0.6}]
},
{
  'id': 'The content can be preserved',
  'name': 'PE6',
  'link_positive': [{'VE3': 0.6}, {'SE3': 0.6}, {'ME5': 0.7}, {'SE2': 0.6}],
  'link_negative': [{'ME4': -0.6}, {'PE4': -0.7}]
},
{
  'id': 'You can extend the language',
  'name': 'CE1',
  'link_positive': [{'VE4': 0.7}, {'PE5': 0.8}, {'ME2': 0.7}, {'PE2': 0.7}, {'TE5': 0.7}, {'SE2': 0.6}],
  'link_negative': [{'TE1': -0.8}, {'SE1': -0.7}, {'ME2': -0.7}, {'TE4': -0.7}, {'PE1': -0.6}]
},
{
  'id': 'You can redefine how it is interpreted',
  'name': 'CE2',
  'link_positive': [{'SA1': 0.7}, {'SA3': 0.7}, {'ME5': 0.7}, {'ME1': 0.6}, {'ME2': 0.6}, {'ME6': 0.6}],
  'link_negative': [{'CE1': -0.7}]
},
{
  'id': 'You can see different things when you look again',
  'name': 'CE3',
  'link_positive': [{'PE4': 0.7}, {'TE2': 0.7}, {'TE3': 0.7}],
  'link_negative': [{'VE2': -0.7}, {'SE1': -0.7}, {'SE3': -0.7}, {'ME2': -0.7}, {'ME3': -0.7}, {'ME4': -0.7}, {'TE4': -0.7}]
},
{
  'id': 'Anything not forbidden is allowed',
  'name': 'CE4',
  'link_positive': [{'TE5': 0.7}, {'PE1': 0.7}, {'PE4': 0.7}, {'ME5': 0.6}],
  'link_negative': [{'ME2': -0.7}, {'TE4': -0.7}, {'VE2': -0.6}, {'IE5': -0.6}, {'PE2': -0.6}]
}

]