namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LugarFechaTerminoCurso : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CursoInterno", "FechaTermino", c => c.DateTime());
            AddColumn("CH.tab_CursoInterno", "Lugar", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CursoInterno", "Lugar");
            DropColumn("CH.tab_CursoInterno", "FechaTermino");
        }
    }
}
