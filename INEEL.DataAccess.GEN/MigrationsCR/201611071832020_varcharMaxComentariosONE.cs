namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class varcharMaxComentariosONE : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "ComentariosEspecialista", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "ComentariosEspecialista");
        }
    }
}
