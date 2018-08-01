namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioColumnasHistorialFI : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionGerencia", c => c.DateTime());
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionPreliminar", c => c.DateTime());
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionFinal", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionFinal", c => c.DateTime(nullable: false));
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionPreliminar", c => c.DateTime(nullable: false));
            AlterColumn("GI.tab_ProductoHistorialFI", "FechaEvaluacionGerencia", c => c.DateTime(nullable: false));
        }
    }
}
