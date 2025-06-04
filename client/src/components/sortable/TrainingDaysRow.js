// import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
// import SortableItem from "./SortableItem";

// function TrainingDaysRow({ trainingDays }) {
//     return (
//         <>
//             <SortableContext
//                 items={trainingDays}
//                 strategy={horizontalListSortingStrategy}
//             >
//                 <ul 
//                     className={styles.training_days}
//                 >
//                     {trainingDays
//                         .sort((a, b) => a.orderInPlan - b.orderInPlan)
//                         .map(day => (
//                             <SortableItem 
//                                 key={day.ID} 
//                                 id={String(day.ID)}
//                                 className={styles.training_day}
//                             >
//                                 <Stack>
//                                     <Stack
//                                         direction="row"
//                                         gap="0.5em"
//                                     >
//                                         <ClickableIcon
//                                             iconSrc="/images/icons/edit.png"
//                                             TrainingDaysRow="Editar"
//                                             handleClick={() => handleModifyTrainingDay(day)}
//                                         />

//                                         <ClickableIcon
//                                             iconSrc="/images/icons/remove.png"
//                                             TrainingDaysRow="Remover"
//                                             handleClick={() => handleRemoveTrainingDay(day.orderInPlan)}
//                                         />
//                                     </Stack>

//                                     <span>
//                                         Dia {day.orderInPlan}
//                                     </span>

//                                     {day.isRestDay ? (
//                                         <p>
//                                             Dia de descanso
//                                         </p>
//                                     ) : (
//                                         <Stack>
//                                             <span>
//                                                 N° Exercícios: {day.trainingSteps.length}
//                                             </span>

//                                             <span>
//                                                 N° Cardios: {day.cardioSessions.length}
//                                             </span>
//                                         </Stack>
//                                     )}

//                                     <p>
//                                         {day.note}
//                                     </p>
//                                 </Stack>
//                             </SortableItem>
//                         ))
//                     }
//                 </ul>
//             </SortableContext>
//         </>
//     );
// }

// export default TrainingDaysRow;