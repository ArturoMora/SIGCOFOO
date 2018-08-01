namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modeloUpdateCurso : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CursoInterno", "PerteneceCP", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CursoInterno", "PerteneceCP");
        }
    }
}
