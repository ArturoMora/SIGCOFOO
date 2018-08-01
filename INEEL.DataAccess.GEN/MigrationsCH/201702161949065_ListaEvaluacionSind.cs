namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ListaEvaluacionSind : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_ListadoEmpleadosSind", "ListaId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_ListadoEmpleadosSind", "ListaId");
        }
    }
}
