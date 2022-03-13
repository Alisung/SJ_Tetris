    
    
        var init=false;
        var myCanvas;
        var context;
        var Stage_copy = Array.from(Array(24),() => Array(12).fill(0));
        var block_copy = Array.from(Array(4),() => Array(4).fill(0));
        var block_size = 25;
        var start_X = 0; //계속 변화시킬 시작지점 
        var start_y = 3; //계속 변화시킬 시작지점
        var bool_fix = false; // down 버튼을 한번 누르면 false 두번누르면 true
        var bool_key = false; //
        var bool_auto = false; // 자동으로 내려갈땐 0 , 키를 누르면 1???
        // 블록 모양을 정하는 변수는 0~6으로 랜덤 할당
        var block_select_1 =  Math.floor(Math.random() * 8);
        // 블록 회전을 정하는 변수는 0~3까지 반복하도록
        var block_select_2 = 0;
        var Time_;
        var W_count = 0;
        var Game_over = false; //게임오버
        var line_count = 0;
        var bool_space = false;
        var img;
        var pat;
        var a = 0;

        function init_() {

            if(init==false) {
                
                myCanvas=document.getElementById("MyCanvas");
                context=myCanvas.getContext("2d");
                img = new Image();
                img.src = "C:/Users/김성진/Desktop/tutorial/sunjin_tutorial/image.png";
                img.onload = function() {
                    pat = context.createPattern(img,'repeat');
                }    
                init=true;
                
                
                document.getElementById("tetris_repid_down_button").onclick = function() {
                    repid_down();
                };  
            }
        }

        // 기본 게임판 복사
        function Copy_Stage() {
            for(var i = 0; i<24; i++) {
                for(var j=0; j<12; j++) {
                    Stage_copy[i][j] = Game_Stage[i][j];
                }
            }
        }
        // 블록 4*4 필요한 만큼 복사 겸 생성
        function create_block() {
            for(var i = 0; i<4; i++) {
                for(var j =0; j<4; j++) {
                    block_copy[i][j] = Tetris_Block[block_select_1][block_select_2][i][j];
                }
            }
        }
        // 충돌 처리
        function Conflict_handling () {
            var block_length_x= start_X +4;
            var block_length_y= start_y +4;  
            
            for(var i = start_X; i< block_length_x; i++) {
                for(var j =start_y; j< block_length_y; j++) {
                    if(Stage_copy[i][j] + block_copy[i -start_X][j-start_y] == 3 ||
                    Stage_copy[i][j] + block_copy[i -start_X][j-start_y] == 5) {
                        return true;
                    }
                }
            }
            return false;
        }
        // 회전
        function block_locate() {
            
            block_select_2++;
            if(block_select_2 >= 4) {
                block_select_2 = 0;
            }
            
            
        }
        // 자동으로 내려오는 함수
        function autodown() {
            if(bool_fix == true) {
                keyfix();
            } 
            start_X++;
            Copy_Stage();
            if(Conflict_handling()) {
                start_X--;
                bool_fix = true;
            }
            clearTimeout(Time_);
            run();
            
        }
        // 버튼 클릭시
        function keydown() {
            
            if(bool_fix == true) {
                keyfix();
            } 
            start_X++;
            Copy_Stage();
            if(Conflict_handling()) {
                start_X--;
                bool_fix = true;
            }
            clearTimeout(Time_);
            run();
            
        }
        function repid_down() {
            if(a == 0) {
                a =1;
                if(bool_fix == true) {
                    keyfix();
                } 
                for(var i =start_X; i<=23; i++) {
                    start_X = i;
                    if(Conflict_handling()) {
                        start_X--;
                        bool_fix =true;
                        break;
                    }
                }
                clearTimeout(Time_);
                run();
            }
            a = 0;
            
        }
        function keyleft(){
            
            start_y--;
            Copy_Stage();
            if(Conflict_handling()) {
                start_y++;
            }
            clearTimeout(Time_);
            run();
        }
        function keyright(){
            
            start_y++;
            Copy_Stage();
            if(Conflict_handling()) {
                start_y--;
            }
            clearTimeout(Time_);
            run();
        }
        function keylotate() {
            
            block_locate();
            create_block();
            Copy_Stage();
            if(Conflict_handling()) {
                block_select_2--;
            }
            clearTimeout(Time_);
            run();
        }
        // 고정시키는 함수  - i가 0,1이 아닐 때 적용됨
        // 블럭의 1 부분을 4로 변환
        // 카피했던 스테이지를 원본 스테이지에 넣는다.
        // 
        function keyfix() {
            for(var i = 0; i<24; i++) {
                for(var j=0; j<12; j++) {
                    Game_Stage[i][j] = Stage_copy[i][j];
                    if(Game_Stage[i][j] == 1) {
                        Game_Stage[i][j] = 4;
                    }
                }
            }
            //작업이 다끝나고 난뒤에 원레 위치로
            block_select_1 =  Math.floor(Math.random() * 8);
            start_X = 0;
            start_y = 3;
            bool_fix = false;
            clearTimeout(Time_);
            delete_block();
            game_over();
            run();

        }

        
        function delete_block() {
            line_count = 0;
            // 가로줄 삭제
            for(var i = 21; i>1; i--) {
                W_count = 0;
                for(var j = 10; j>0; j--) {
                    if(Game_Stage[i][j] == 4) {
                        W_count++;
                    }
                }
                if(W_count == 10) {
                    for(k =10; k>0; k--) {
                        Game_Stage[i][k] = 0;
                        
                    }
                    
                }
            }

            for(var i = 21; i>1; i--) {
                for(var k =10; k>0; k--) {
                    // 빈 공간 찾기
                    if(Game_Stage[i][k] == 4) {
                        bool_space = false;
                    }

                    if(Game_Stage[i][k] == 0 && bool_space == true) {
                        
                        if(k == 1) {
                            line_count ++; // 빈 줄 개수++
                        }
                    }

                    if(Game_Stage[i][k] == 4 && line_count>0) {
                        
                        for(var j = 10; j>0; j--) {
                                Game_Stage[i+line_count][j] = Game_Stage[i][j];
                                Game_Stage[i][j] =0;
                            }
                        }
                    
                }
                bool_space = true;
                
            }

        }

        function game_over() {
            for(var i = 1; i<11; i++) {
                if (Game_Stage[2][i] ==4) {
                    alert("Game Over");
                    Game_over = true;
                }
            }
        }

        function run() {
            if(Game_over == false) {
                if( bool_auto == false) {
                    Time_ = setTimeout(autodown,500);
                }
                Copy_Stage(); 
                create_block();
                tetris_block_rocation();
                drowing_stage();
            }     
        }
        
        // stage_copy 배열에 블록을 놓는 함수
        // 스테이지에 블록을 for을 이용해 원하는 위치에 붙여넣기
        function tetris_block_rocation() {
            var block_length_x= start_X +4;
            var block_length_y= start_y +4;
            for(var i = start_X; i< block_length_x; i++) {
                for(var j =start_y; j< block_length_y; j++) {

                    if(Stage_copy[i][j] == 2) {
                        block_copy[i -start_X][j-start_y] = 2;
                    }
                    else if(Stage_copy[i][j] == 4) {
                        block_copy[i -start_X][j-start_y] = 4; 
                    } else {
                        Stage_copy[i][j]= block_copy[i -start_X][j-start_y]; //1 일떄
                    }
                    
                    
                }
            }
        }

        // 배열의 숫자가 바뀐 뒤에 실행 할 예정.
        function drowing_stage() {
            
            for(var i = 1; i <24; i++) {
                for(var j = 0; j<12; j++) {
                    if(Stage_copy[i][j] == 0) {
                        if(i==1 && j >=1 && j<=10) {
                            context.fillStyle ="silver";
                        } else {
                            context.fillStyle = "white";
                        }

                    } else if(Stage_copy[i][j] == 2 || Stage_copy[i][j] == 4) {
                        if(i>=2 && i<22 && j>=1 && j<=10 && Stage_copy[i][j] == 4) {
                            context.fillStyle = "green";
                        } else {
                            context.fillStyle = "silver";
                        }
                        
                    } else if(Stage_copy[i][j] == 1 && !(i==1 && j >=1 && j<=10)) {
                        context.fillStyle = pat;
                    }
                    if(i < 23) {
                        if((Stage_copy[i][j] ==2 || Stage_copy[i][j] ==4) && !(i>=2 && i<22 && j>=1 && j<=10)) {
                            context.fillRect(block_size*j,block_size*i,block_size,block_size);
                        } else if(i==1 && j >=1 && j<=10) {
                            context.fillRect(block_size*j,block_size*i,block_size,block_size);
                        } 
                        else {
                            context.fillRect(block_size*j,block_size*i,block_size-1,block_size-1);
                        }
                        
                        
                    }
                }
            }
            
        }
        
