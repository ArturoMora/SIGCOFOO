namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adjuntoCursos2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CursoInterno", "PrivadoPublico", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CursoInterno", "PrivadoPublico");
        }
    }
}
