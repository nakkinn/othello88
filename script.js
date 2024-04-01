const gridsize = 60;
const n = 8;

let stone = new Array(n);
for(let i=0; i<stone.length; i++)   stone[i] = new Array(n);
for(let i=0; i<n; i++)  for(let j=0; j<n; j++)  stone[i][j] = 2;

let col1 = 0;
let pass1 = false;

let mode = -1;
let posecount = 0;

let my, mx;

let select1 = document.getElementById('select1');

let button1 = document.getElementById('button1');
button1.addEventListener('click',()=>{
    console.log(select1.value);
    if(select1.value=='先手')   mode = 1;
    else    mode = 0;
    console.log(mode);
});

function setup(){
    createCanvas(windowWidth, windowHeight);
    gridsize = Math.min(width, height)/n*0.9;

    stone[4][4] = 1;
    stone[3][3] = 1;
    stone[3][4] = 0;
    stone[4][3] = 0;

}

function draw(){
    background(255);

    let py=-1, px=-1;
    if(mouseY<n*gridsize && mouseX<n*gridsize){
        py = int(mouseY/gridsize);
        px = int(mouseX/gridsize);
    }


    stroke(0);
    for(let i=0; i<n; i++)  for(let j=0; j<n; j++){
        noFill();
        if(i==py && j==px)  fill(230);
        rect(j*gridsize, i*gridsize, gridsize);

        if(stone[i][j]!=2){
            fill(stone[i][j]*255);
            circle((j+0.5)*gridsize, (i+0.5)*gridsize, gridsize*0.75);
        }

        
    }

    strokeWeight(3);
    stroke(255, 0, 0);
    noFill();
    rect(mx*gridsize, my*gridsize, gridsize);
    strokeWeight(1);

    noStroke();
    fill(100, 100 ,200);
    if(mode==1){
        let el = enablelist(assyuku(stone),1);
        for(let i=0; i<el.length; i++){
            circle(el[i][1]*gridsize+gridsize*0.5, el[i][0]*gridsize+gridsize*0.5, gridsize/8);
        }
    }


    if(mode!=-1)    posecount++;
    if(posecount==60 && mode==0){
        cpu2(0);
        if(enablelist(assyuku(stone),1).length>0){
            mode = 1;
        }else if(enablelist(assyuku(stone),0).length>0){
            posecount = 0;
        }
    }

    noStroke();
    fill(0);
    textSize(50);
    // if(mode==1) text('あなたの番です', 50, gridsize*n+30);

    let bcou = 0;
    let wcou = 0;
    for(let i=0; i<n; i++)  for(let j=0; j<n; j++){
        if(stone[i][j]==0)  bcou++;
        if(stone[i][j]==1)  wcou++;
    }

    text('黒：'+bcou, 50, gridsize*n+110);
    text('白：'+wcou, 340, gridsize*n+110)


}



function taisen_step(){

    code = assyuku(stone);

    if(enablelist(code,col1).length>0){
        if(col1==1)  cpu1(col1);
        else    cpu2(col1);
        col1 = (col1+1)%2;
        pass1 = false;    
    }else if(!pass1){
        pass1 = true;
        col1 = (col1+1)%2;
    }else{
        console.log('end', calcscore(assyuku(stone)));
        noLoop();
    }
}


function taisen(){

    let code;
    let col = 0;
    let pass = false;

    
    for(let k=0; k<300; k++){

        code = assyuku(stone);

        if(enablelist(code,col).length>0){
            if(col==1)  cpu1(col);
            else    cpu2(col);
            col = (col+1)%2;
            pass = false;    
        }else if(!pass){
            pass = true;
            col = (col+1)%2;
        }else{
            break;
        }

    }

    count_stone(code, 0);

}


function keyPressed(){
    if(key=='Enter'){
        cpu2(0);
    }
}


function touchStarted(){

    if(mouseY<gridsize*n && mouseX<gridsize*n && mode==1){

        let py, px;
        py = int(mouseY/gridsize);
        px = int(mouseX/gridsize);

        my = py;
        mx = px;

        let el = enablelist(assyuku(stone),1);

        let flag = false;
        for(let i=0; i<el.length; i++){
            if(py==el[i][0] && px==el[i][1]){
                flag = true;
                break;
            }
        }

        if(flag){

            reverse_stone(py, px, 1);

            if(enablelist(assyuku(stone), 0).length>0){
                mode = 0;
                posecount = 0;
            }

        }

    }

    
}




function reverse_stone(ya, xa, col){
    
    let dy = [-1,-1,0,1,1,1,0,-1];
    let dx = [0,1,1,1,0,-1,-1,-1];

    let y,x;
    for(let k=0; k<8; k++){
        loop1:for(let m=1; m<n; m++){
            y = ya + dy[k]*m;
            x = xa + dx[k]*m;
            if(y<0 || x<0 || y>=n || x>=n)  break loop1;
            if((m==1 && stone[y][x]==col) || stone[y][x]==2)    break loop1;
            if(m>1 && stone[y][x]==col){
                for(let j=1; j<m; j++){
                    stone[ya+dy[k]*j][xa+dx[k]*j] = col;
                    change = true;
                }
                stone[ya][xa] = col;
                break loop1;
            }
        }
    }

}

function reverse_stone2(code, ya, xa, col){


    let board = kaitou(code);
    
    let dy = [-1,-1,0,1,1,1,0,-1];
    let dx = [0,1,1,1,0,-1,-1,-1];

    let y,x;
    for(let k=0; k<8; k++){
        loop1:for(let m=1; m<n; m++){
            y = ya + dy[k]*m;
            x = xa + dx[k]*m;
            if(y<0 || x<0 || y>=n || x>=n)  break loop1;
            if((m==1 && board[y][x]==col) || board[y][x]==2)    break loop1;
            if(m>1 && board[y][x]==col){
                for(let j=1; j<m; j++){
                    board[ya+dy[k]*j][xa+dx[k]*j] = col;
                    change = true;
                }
                board[ya][xa] = col;
                break loop1;
            }
        }
    }

    return assyuku(board);
}


function assyuku(arg){
    let result = ''
    for(let i=0; i<n; i++)  for(let j=0; j<n; j++){
        result += arg[i][j];
    }
    return result;
}

function kaitou(arg){
    let result = new Array(n);
    for(let i=0; i<result.length; i++)  result[i] = new Array(n);
    for(let i=0; i<n; i++)  for(let j=0; j<n; j++){
        result[i][j] = Number(arg.charAt(i*n+j));
    }
    return result;
}

function cpu1(col){

    kouho = enablelist(assyuku(stone), col);
    
    let index = int(Math.random()*kouho.length);
    //index = 0;

    let y,x;
    y = kouho[index][0];
    x = kouho[index][1];

    reverse_stone(y, x, col);


}


function cpu2(col){

    let code = assyuku(stone);
    let y,x;

    if(count_stone(code,0)+count_stone(code,1)>=n*n-10){

        let tmp = zentansa(code, col);
        y = tmp[0];
        x = tmp[1];

    }else{

        let tmp = tansa(code, col);
        y = tmp[0];
        x = tmp[1];

    }

    my = y;
    mx = x;

    reverse_stone(y, x, col);


}


//[y,x]にcolの石をおける場所
function enablelist(code, col){

    let result = [];
    let board = kaitou(code);

    let dy = [-1,-1,0,1,1,1,0,-1];
    let dx = [0,1,1,1,0,-1,-1,-1];

    for(let i=0; i<n; i++)  for(let j=0; j<n; j++)  if(board[i][j]==2){

        let y,x;
        loop2:for(let k=0; k<8; k++){
            loop1:for(let m=1; m<n; m++){
                y = i + dy[k]*m;
                x = j + dx[k]*m;
                if(y<0 || x<0 || y>=n || x>=n)  break loop1;
                if((m==1 && board[y][x]==col) || board[y][x]==2)    break loop1;
                if(m>1 && board[y][x]==col){
                    result.push([i,j]);
                    break loop2;
                }
            }
        }

    }

    return result;
}


function count_stone(code, col){
    let result = 0;
    for(let i=0; i<code.length; i++){
        if(Number(code.charAt(i))==col) result++;
    }
    return result;
}



function zentansa(codea, cola){

    let lista = [];

    let kouho;
    let klen;
    
    kouho = enablelist(codea, cola);
    klen = kouho.length;
    
    for(let i=0; i<kouho.length; i++){
        lista[i] = {sasite:kouho[i], col:cola, code:reverse_stone2(codea, kouho[i][0], kouho[i][1], cola), parent:-1, child:null};
    }

    for(let i=0; i<lista.length; i++){

        if(lista[i].child==null){

            let kouho0 = enablelist(lista[i].code, (lista[i].col+1)%2);
            let kouho1 = enablelist(lista[i].code, lista[i].col);

            if(kouho0.length>0){
                let tmp = [];
                for(let j=lista.length; j<lista.length+kouho0.length; j++)  tmp.push(j);
                lista[i].child = tmp;
                for(let j=0; j<kouho0.length; j++){
                    lista.push({sasite:kouho0[j], col:(lista[i].col+1)%2, code:reverse_stone2(lista[i].code, kouho0[j][0], kouho0[j][1], (lista[i].col+1)%2), parent:i, child:null});
                }
            }else if(kouho1.length>0){
                let tmp = [];
                for(let j=lista.length; j<lista.length+kouho1.length; j++)  tmp.push(j);
                lista[i].child = tmp;
                for(let j=0; j<kouho1.length; j++){
                    lista.push({sasite:kouho1[j], col:lista[i].col, code:reverse_stone2(lista[i].code, kouho1[j][0], kouho1[j][1], lista[i].col), parent:i, child:null});
                }
            }else{
                lista[i].child = -1;
            }
        }

    }


    for(let i=0; i<lista.length; i++){
        if(lista[i].child==-1)  lista[i].score = calcscore(lista[i].code);
    }

    let tmp = [lista[lista.length-1].score];

    for(let i=lista.length-2; i>=0; i--){
        if(lista[i].parent==lista[i+1].parent)  tmp.push(lista[i].score);
        else if(tmp.length>0){
            if(lista[i+1].col==0)   lista[lista[i+1].parent].score = Math.max(...tmp);
            else    lista[lista[i+1].parent].score = Math.min(...tmp);
            tmp = [lista[i].score];
        }
    }


    let maxscore = lista[0].score;
    let index = 0;
    for(let i=1; i<klen; i++){
        if(cola==0 && lista[i].score>maxscore){
            maxscore = lista[i].score;
            index = i;
        }
        if(cola==1 && lista[i].score<maxscore){
            maxscore = lista[i].score;    
            index = i;
        }
    }

    console.log('yosoku', lista[index].score);
    return lista[index].sasite;

}



function tansa(codea, cola){

    lista = [];

    let kouho;
    let klen;

    kouho = enablelist(codea, cola);
    klen = kouho.length;

    for(let i=0; i<kouho.length; i++){
        lista[i] = {sasite:kouho[i], col:cola, code:reverse_stone2(codea, kouho[i][0], kouho[i][1], cola), parent:-1, child:null};
    }

    let listalen;


    for(let k=0; k<4; k++){

        listalen = lista.length;

        for(let i=0; i<listalen; i++){

            if(lista[i].child==null){

                let kouho0 = enablelist(lista[i].code, (lista[i].col+1)%2);
                let kouho1 = enablelist(lista[i].code, lista[i].col);

                if(kouho0.length>0){
                    let tmp = [];
                    for(let j=lista.length; j<lista.length+kouho0.length; j++)  tmp.push(j);
                    lista[i].child = tmp;
                    for(let j=0; j<kouho0.length; j++){
                        lista.push({sasite:kouho0[j], col:(lista[i].col+1)%2, code:reverse_stone2(lista[i].code, kouho0[j][0], kouho0[j][1], (lista[i].col+1)%2), parent:i, child:null});
                    }
                }else if(kouho1.length>0){
                    let tmp = [];
                    for(let j=lista.length; j<lista.length+kouho1.length; j++)  tmp.push(j);
                    lista[i].child = tmp;
                    for(let j=0; j<kouho1.length; j++){
                        lista.push({sasite:kouho1[j], col:lista[i].col, code:reverse_stone2(lista[i].code, kouho1[j][0], kouho1[j][1], lista[i].col), parent:i, child:null});
                    }
                }else{
                    lista[i].child = null;
                }
            }

            
        }

    }


    for(let i=0; i<lista.length; i++){
        if(lista[i].child==null){
            let cou0 = enablelist(lista[i].code, 0).length;
            let cou1 = enablelist(lista[i].code, 1).length;
            if(cou0==0 && cou1==0){
                lista[i].score = calcscore(lista[i].code)*10000;
            }else{
                lista[i].score = cou0 - cou1;
                lista[i].score += edgepoint(lista[i].code, lista[i].col);
            }
        }
    }


    let tmp = [lista[lista.length-1].score];

    for(let i=lista.length-2; i>=0; i--){
        if(lista[i].parent==lista[i+1].parent)  tmp.push(lista[i].score);
        else if(tmp.length>0){
            if(lista[i+1].col==0)   lista[lista[i+1].parent].score = Math.max(...tmp);
            else    lista[lista[i+1].parent].score = Math.min(...tmp);
            tmp = [lista[i].score];
        }
    }


    let maxscore = lista[0].score;
    let index = 0;
    for(let i=1; i<klen; i++){
        if(cola==0 && lista[i].score>maxscore){
            maxscore = lista[i].score;
            index = i;
        }
        if(cola==1 && lista[i].score<maxscore){
            maxscore = lista[i].score;    
            index = i;
        }
    }

    console.log('yosoku0', lista[index].score);
    return lista[index].sasite;

}


//0と1の差
function calcscore(code){
    let result = 0;
    for(let i=0; i<code.length; i++){
        if(code.charAt(i)=='0') result++;
        if(code.charAt(i)=='1') result--;
    }
    return result;
}



function edgepoint(code, cola){

    result = 0;

    let weight1=20, weight2=3;

    if(code.charAt(0)=='0') result+=weight1;
    if(code.charAt(0)=='1') result+=-weight1;
    if(code.charAt(n-1)=='0') result+=weight1;
    if(code.charAt(n-1)=='1') result+=-weight1;
    if(code.charAt(n*(n-1))=='0') result+=weight1;
    if(code.charAt(n*(n-1))=='1') result+=-weight1;
    if(code.charAt(n*n-1)=='0') result+=weight1;
    if(code.charAt(n*n-1)=='1') result+=-weight1;

    if(code.charAt(0)=='2' && code.charAt(9)=='0')  result-=weight2;
    if(code.charAt(0)=='2' && code.charAt(9)=='1')  result+=weight2;
    if(code.charAt(7)=='2' && code.charAt(14)=='0')  result-=weight2;
    if(code.charAt(7)=='2' && code.charAt(14)=='1')  result+=weight2;
    if(code.charAt(56)=='2' && code.charAt(49)=='0')  result-=weight2;
    if(code.charAt(56)=='2' && code.charAt(49)=='1')  result+=weight2;
    if(code.charAt(63)=='2' && code.charAt(54)=='0')  result-=weight2;
    if(code.charAt(63)=='2' && code.charAt(54)=='1')  result+=weight2;

    let tmp;

    tmp = [code.charAt(0), code.charAt(1), code.charAt(2), code.charAt(3), code.charAt(4), code.charAt(5), code.charAt(6), code.charAt(7)];
    fa1();
    tmp = [code.charAt(7), code.charAt(15), code.charAt(23), code.charAt(31), code.charAt(39), code.charAt(47), code.charAt(55), code.charAt(63)];
    fa1();
    tmp = [code.charAt(56), code.charAt(57), code.charAt(58), code.charAt(59), code.charAt(60), code.charAt(61), code.charAt(62), code.charAt(63)];
    fa1();
    tmp = [code.charAt(0), code.charAt(8), code.charAt(16), code.charAt(24), code.charAt(32), code.charAt(40), code.charAt(48), code.charAt(56)];
    fa1();
    tmp = [code.charAt(0), code.charAt(9), code.charAt(18), code.charAt(27), code.charAt(36), code.charAt(45), code.charAt(54), code.charAt(63)];
    fa1();
    tmp = [code.charAt(7), code.charAt(14), code.charAt(21), code.charAt(28), code.charAt(35), code.charAt(42), code.charAt(49), code.charAt(56)];
    fa1();

    function fa1(){
        if(cola==0){
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='1')   result-=10;
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='0' && tmp[3]=='1')   result-=12;
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='0' && tmp[3]=='0' && tmp[4]=='1')   result-=14;
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='0' && tmp[3]=='0' && tmp[4]=='0' && tmp[5]=='1')   result-=16;
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='0' && tmp[3]=='0' && tmp[4]=='0' && tmp[5]=='0' && tmp[6]=='1')   result-=18;
            if(tmp[0]=='2' && tmp[1]=='0' && tmp[2]=='0' && tmp[3]=='0' && tmp[4]=='0' && tmp[5]=='0' && tmp[6]=='0' && tmp[7]=='1')   result-=20;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='1')   result-=10;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='0' && tmp[4]=='1')   result-=12;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='0' && tmp[4]=='0' && tmp[3]=='1')   result-=14;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='0' && tmp[4]=='0' && tmp[3]=='0' && tmp[2]=='1')   result-=16;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='0' && tmp[4]=='0' && tmp[3]=='0' && tmp[2]=='0' && tmp[1]=='1')   result-=18;
            if(tmp[7]=='2' && tmp[6]=='0' && tmp[5]=='0' && tmp[4]=='0' && tmp[3]=='0' && tmp[2]=='0' && tmp[1]=='0' && tmp[0]=='1')   result-=20;
        }else{
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='0')   result+=10;
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='1' && tmp[3]=='0')   result+=12;
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='1' && tmp[3]=='1' && tmp[4]=='0')   result+=14;
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='1' && tmp[3]=='1' && tmp[4]=='1' && tmp[5]=='0')   result+=16;
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='1' && tmp[3]=='1' && tmp[4]=='1' && tmp[5]=='1' && tmp[6]=='0')   result+=18;
            if(tmp[0]=='2' && tmp[1]=='1' && tmp[2]=='1' && tmp[3]=='1' && tmp[4]=='1' && tmp[5]=='1' && tmp[6]=='1' && tmp[7]=='0')   result+=20;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='0')   result-=10;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='1' && tmp[4]=='0')   result+=12;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='1' && tmp[4]=='1' && tmp[3]=='0')   result+=14;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='1' && tmp[4]=='1' && tmp[3]=='1' && tmp[2]=='0')   result+=16;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='1' && tmp[4]=='1' && tmp[3]=='1' && tmp[2]=='1' && tmp[1]=='0')   result+=18;
            if(tmp[7]=='2' && tmp[6]=='1' && tmp[5]=='1' && tmp[4]=='1' && tmp[3]=='1' && tmp[2]=='1' && tmp[1]=='1' && tmp[0]=='0')   result+=20;
        }
    }

    return result;
}
