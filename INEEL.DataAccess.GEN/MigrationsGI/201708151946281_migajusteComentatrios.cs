namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migajusteComentatrios : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_ProductoGISolicitud", "ComentariosSolicitante", c => c.String());
            AddColumn("GI.tab_ProductoGISolicitud", "ComentariosComite", c => c.String());
            DropColumn("GI.tab_ProductoGISolicitud", "ComentatriosSolicitante");
            DropColumn("GI.tab_ProductoGISolicitud", "ComentatriosComite");
        }
        
        public override void Down()
        {
            AddColumn("GI.tab_ProductoGISolicitud", "ComentatriosComite", c => c.String());
            AddColumn("GI.tab_ProductoGISolicitud", "ComentatriosSolicitante", c => c.String());
            DropColumn("GI.tab_ProductoGISolicitud", "ComentariosComite");
            DropColumn("GI.tab_ProductoGISolicitud", "ComentariosSolicitante");
        }
    }
}
